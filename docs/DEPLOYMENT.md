# EC2 deployment through GHCR and SSH

GitHub Actions tests the Docker images, publishes the exact tested images to GitHub Container Registry (GHCR), and uploads the Compose file and deployment script with `appleboy/scp-action@v1`, then runs them with `appleboy/ssh-action@v1`. EC2 pulls and runs those images. AWS CLI, ECR, Systems Manager, and a Git checkout on EC2 are not required.

The initial target is Ubuntu on the x86-64 instance `15.134.206.246` in `ap-southeast-2`.

| Service    | Public URL                 | Internal address |
| ---------- | -------------------------- | ---------------- |
| Website    | http://15.134.206.246:9001 | `website:9001`   |
| App        | http://15.134.206.246:9002 | `app:9002`       |
| API        | None                       | `api:8000`       |
| PostgreSQL | None                       | `postgres:5432`  |

Use test accounts until HTTPS is configured. Reserve an Elastic IP if this address must survive instance stop/start. The `t3.micro` has limited memory: builds stay in CI, but monitor runtime memory and disk and consider more capacity before production traffic.

## 1. Prepare EC2

Docker Engine and Compose must already be installed. Run on EC2:

```bash
sudo systemctl enable --now docker
sudo docker version
sudo docker compose version
sudo -n true
command -v bash flock tar
sudo install -d -m 700 /opt/shsg /opt/shsg/releases /opt/shsg/backups
free -h
df -h /
swapon --show
```

The SSH account needs unattended sudo. Its deployment key can execute privileged commands; restrict it to the production environment and protect workflow changes. Optional swap on a test host with sufficient free disk and no existing `/swapfile`:

```bash
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
# Add once to /etc/fstab for reboot persistence:
# /swapfile none swap sw 0 0
```

Allow TCP 9001/9002 from intended visitors in the EC2 security group. Keep 8000/5432 closed. SSH port 22 must allow your administrative IP and the deployment runner network. EC2 needs outbound HTTPS to GHCR and its image-layer storage.

SSH working from your Mac does not establish GitHub runner connectivity. Standard hosted runners have changing outbound IPs. Choose a reachable runner network, such as a fixed-egress runner or private network, and allow that source; a rule allowing only your Mac will block Actions. See [GitHub runner networking](https://docs.github.com/en/actions/reference/runners/github-hosted-runners#ip-addresses). The workflow uses `ubuntu-24.04`; change its deployment runner if your network requires a dedicated runner.

## 2. Configure verified SSH

On your Mac, create a dedicated key if one is not already configured:

```bash
ssh-keygen -t ed25519 -C shsg-github-deploy -f ~/.ssh/shsg_deploy -N ""
cat ~/.ssh/shsg_deploy.pub
```

Append the public key to EC2's `/home/ubuntu/.ssh/authorized_keys`, preserving existing keys. Use mode 700 for `.ssh` and 600 for `authorized_keys`. Test from your Mac:

```bash
ssh -i ~/.ssh/shsg_deploy ubuntu@15.134.206.246
```

Get the host fingerprint from a trusted EC2 terminal:

```bash
sudo awk '{print "15.134.206.246", $1, $2}' /etc/ssh/ssh_host_*_key.pub
```

Copy all output lines from the trusted EC2 terminal into the `SSH_KNOWN_HOSTS` production secret. These are public server keys, not the deployment private key. If collecting keys on your Mac instead, compare each fingerprint against the corresponding key read directly on EC2:

```bash
ssh-keyscan -t ecdsa,rsa,ed25519 15.134.206.246 > ~/.ssh/shsg_known_hosts
ssh-keygen -lf ~/.ssh/shsg_known_hosts
```

Only use this file after comparison. The workflow selects a trusted key in the Go SSH client's preference order (ECDSA, RSA, then Ed25519). An Ed25519-only entry can mismatch when the server also offers ECDSA: each algorithm has a different fingerprint. Do not disable fingerprint verification or automatically trust keys obtained from the network.

## 3. Configure GHCR pull access

Images publish as `ghcr.io/LOWERCASE_OWNER/shsg-website`, `shsg-app`, and `shsg-api` with full commit SHA tags. For this repository the namespace is `ghcr.io/adarshsharma11`. Actions publishes with its built-in token and `packages: write`. Existing packages must grant this repository Actions access. Keep previous images available for rollback.

For private packages, create a personal access token (classic) with `read:packages` for an account with package access; authorize organizational SSO if required. In the EC2 terminal:

```bash
read -rsp "GitHub package token: " GHCR_TOKEN
printf '\n'
printf '%s' "$GHCR_TOKEN" | sudo docker login ghcr.io --username YOUR_GITHUB_USERNAME --password-stdin
unset GHCR_TOKEN
```

Expect `Login Succeeded`. Use sudo because the deployment runs Docker as root. Actual pull permissions are verified once images exist. Renew the login when the token expires. Packages are private on initial publication; review their access settings. [GHCR authentication documentation](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry)

## 4. Configure production environment

Create `/opt/shsg/.env.production` using [deploy/.env.example](../deploy/.env.example). No checkout is required; paste its contents through your EC2 terminal. Preserve an already configured file.

```bash
openssl rand -hex 32
openssl rand -hex 32
sudo touch /opt/shsg/.env.production
sudo chmod 600 /opt/shsg/.env.production
sudo nano /opt/shsg/.env.production
```

Use separate generated secrets for PostgreSQL and JWT signing. Keep `IMAGE_REGISTRY=ghcr.io/adarshsharma11` for this owner. The deployment script supplies the actual registry and SHA tag. Changing a password in this file does not change the password in an already initialized PostgreSQL database; coordinate later rotations.

The frontend backend address is `http://api:8000` inside Docker; browser requests use same-origin `/api` routes. Website navigation is built into the image, so keep GitHub URL variables and EC2 settings consistent and rebuild when changing the public destination. Actions cannot read the EC2 environment file during builds.

## 5. Configure GitHub

Create **Settings → Environments → production**, allowing deployments only from `main`. Add these environment secrets:

| Secret            | Value                                          |
| ----------------- | ---------------------------------------------- |
| `SSH_HOST`        | `15.134.206.246`                               |
| `SSH_USER`        | `ubuntu`                                       |
| `SSH_PRIVATE_KEY` | Full contents of `~/.ssh/shsg_deploy`          |
| `SSH_KNOWN_HOSTS` | Verified contents of `~/.ssh/shsg_known_hosts` |

If your deployment private key is encrypted, also add `DEPLOY_KEY_PASSPHRASE`. Leave it unset for the unencrypted key created above. Both actions verify the host fingerprint derived from `SSH_KNOWN_HOSTS`. No Python deployment helper is required; the production smoke check uses Node.js.

For automatic deployment, configure the environment without manual reviewers, subject to your organization's protection requirements. On your Mac, `pbcopy < ~/.ssh/shsg_deploy` copies the key directly for pasting into the secret.

Add **repository-level** Actions variables:

| Variable            | Value                                                   |
| ------------------- | ------------------------------------------------------- |
| `DEPLOY_ENABLED`    | `false` during setup; `true` when ready                 |
| `SHSG_APP_URL`      | `http://15.134.206.246:9002`                            |
| `SHSG_CORS_ORIGINS` | `http://15.134.206.246:9001,http://15.134.206.246:9002` |

URL variables must be repository-scoped because production-image checks run before the deployment environment. Tests use localhost defaults when unset; release builds require explicit URLs. AWS deployment variables are no longer used and can be removed. Protect `main` with **Required checks**, and permit package publishing according to repository/organization policy.

## 6. Enable deployment

First commit/push this workflow with `DEPLOY_ENABLED=false` and verify all checks pass. After the EC2 configuration, GHCR login, SSH secrets, and runner network are ready, set `DEPLOY_ENABLED=true` and push/merge a new commit to `main`.

CI tests both production frontends, API connectivity, signup/login, and migrations. The exact tested images pass to the deployment job as a short-lived artifact. Only after all required checks pass does the job publish to GHCR and upload only the two deployment files into a temporary server directory and execute the release through the SSH action. The actions use the verified host fingerprint. The server-side temporary upload directory is removed before running the release. No `git pull` on EC2 is necessary.

The remote script locks deployment, pulls images, starts PostgreSQL, backs it up, applies committed migrations, then starts the API and frontends with health checks. Remote command failures fail the job. Migration failures prevent application replacement; a later startup failure can leave a partially updated stack. This single-instance setup can have brief downtime.

Pull requests and non-main branches do not deploy. Manual dispatch on `main` runs the same checks and can deploy when enabled. An unset/false `DEPLOY_ENABLED` skips deployment. For a manual retry of an already transferred release:

```bash
sudo bash /opt/shsg/releases/COMMIT_SHA/deploy.sh ghcr.io/adarshsharma11 COMMIT_SHA
```

## 7. Logs, migrations, backups, and rollback

Create, review, and commit migration files during development. Each release runs a fresh `alembic upgrade head` task and verifies migration heads. Production never generates migrations or automatically downgrades a database. Use backward-compatible migrations while old containers still serve traffic.

The named volume `shsg-production_postgres_data` survives container replacement. Never run `docker compose down --volumes` on production. The script creates local pre-deployment backups in `/opt/shsg/backups`. It does not upload or schedule backups: arrange off-instance copies, retention, scheduled backups, and a tested restore before storing real customer data. Local files and volumes do not protect against disk/instance loss.

Inspect the latest healthy release in a root shell:

```bash
sudo -i
cd "$(cat /opt/shsg/current-release)"
export IMAGE_REGISTRY=ghcr.io/adarshsharma11 IMAGE_TAG="${PWD##*/}"
docker compose --env-file /opt/shsg/.env.production -f compose.production.yml ps --all
docker compose --env-file /opt/shsg/.env.production -f compose.production.yml logs --tail=100 api website app
```

For failed deployments, inspect `/opt/shsg/releases/COMMIT_SHA`. The current marker only changes after health checks succeed; the preceding healthy path is in `/opt/shsg/previous-release`. Logs rotate; Docker does not restart a running process solely because its health check fails.

Before application rollback, confirm the current database is compatible with the target version. From a root shell:

```bash
cd /opt/shsg/releases/KNOWN_HEALTHY_COMMIT_SHA
export IMAGE_REGISTRY=ghcr.io/adarshsharma11 IMAGE_TAG=KNOWN_HEALTHY_COMMIT_SHA
docker compose --env-file /opt/shsg/.env.production -f compose.production.yml \
  up --detach --no-deps --wait --wait-timeout 240 api website app
```

This does not run migrations. After verifying recovery, update the current-release marker. Database restoration is a separate maintenance operation with application writes stopped and a verified backup.
