#!/usr/bin/env bash
# Run on EC2 as root, from the directory containing compose.production.yml.
set -Eeuo pipefail
umask 077

region=${1:?AWS region is required}
registry=${2:?ECR registry is required}
revision=${3:?Commit SHA is required}
backup_s3_uri=${4:-}
[[ "$revision" =~ ^[0-9a-f]{40}$ ]] || { echo 'Expected a full commit SHA'; exit 1; }
[[ "$registry" =~ ^[0-9]{12}\.dkr\.ecr\.[a-z0-9-]+\.amazonaws\.com$ ]] || { echo 'Invalid ECR registry'; exit 1; }
[[ "$region" =~ ^[a-z0-9-]+$ ]] || exit 1

cd -- "$(dirname -- "${BASH_SOURCE[0]}")"
test -f /opt/shsg/.env.production || { echo 'Create /opt/shsg/.env.production before deploying'; exit 1; }
exec 9>/opt/shsg/deploy.lock
flock -n 9 || { echo 'Another deployment is running'; exit 1; }
export IMAGE_REGISTRY="$registry" IMAGE_TAG="$revision"
compose=(docker compose --env-file /opt/shsg/.env.production -f compose.production.yml)
"${compose[@]}" config --quiet

aws ecr get-login-password --region "$region" | docker login --username AWS --password-stdin "$registry"
"${compose[@]}" pull
"${compose[@]}" up --detach --wait --wait-timeout 180 postgres

mkdir -p /opt/shsg/backups
backup="/opt/shsg/backups/$(date -u +%Y%m%dT%H%M%SZ)-${revision}.dump"
# Back up before changing the schema, including on the first deployment.
"${compose[@]}" exec -T postgres sh -c 'pg_dump -U "$POSTGRES_USER" -d "$POSTGRES_DB" -Fc' > "$backup"
test -s "$backup"
if [[ -n "$backup_s3_uri" ]]; then
  [[ "$backup_s3_uri" == s3://* ]] || { echo 'Backup destination must start with s3://'; exit 1; }
  aws s3 cp "$backup" "${backup_s3_uri%/}/$(basename "$backup")" --region "$region" --only-show-errors
fi

# Always run a fresh migration task; a previously completed container is not sufficient.
# Existing app containers remain running until this task succeeds.
"${compose[@]}" run --rm --no-deps migrate
"${compose[@]}" run --rm --no-deps migrate alembic current --check-heads
"${compose[@]}" up --detach --no-deps --wait --wait-timeout 240 api
"${compose[@]}" up --detach --no-deps --wait --wait-timeout 240 website app

if [[ -f /opt/shsg/current-release ]] && [[ "$(cat /opt/shsg/current-release)" != "$PWD" ]]; then
  cp /opt/shsg/current-release /opt/shsg/previous-release
fi
printf '%s\n' "$PWD" > /opt/shsg/current-release
"${compose[@]}" ps
echo "Deployment healthy: $revision"
