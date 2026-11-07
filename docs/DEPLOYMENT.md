# EC2 deployment

This deployment targets `15.134.206.246` (`ec2-15-134-206-246.ap-southeast-2.compute.amazonaws.com`) in `ap-southeast-2`, using Linux x86-64 images for the `t3.micro` instance.

| Service        | Public URL                 | Docker access   |
| -------------- | -------------------------- | --------------- |
| Website        | http://15.134.206.246:9001 | `website:9001`  |
| Operations app | http://15.134.206.246:9002 | `app:9002`      |
| FastAPI        | None                       | `api:8000`      |
| PostgreSQL     | None                       | `postgres:5432` |

This public-IP setup uses HTTP. Use test accounts until HTTPS is configured; passwords and bearer tokens otherwise travel without transport encryption. Reserve an Elastic IP if this address must survive an EC2 stop/start. When domains are ready, add a reverse proxy with HTTPS, remove direct public access to 9001/9002, and update the app URL and allowed origins.

## 1. Prepare the instance once

Confirm the operating system in EC2 before installing software. Install Docker Engine with its Compose plugin, AWS CLI v2, and ensure the SSM Agent is running:

- [Docker on Ubuntu](https://docs.docker.com/engine/install/ubuntu/)
- [Docker on Amazon Linux](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/install-docker.html)
- [AWS CLI v2 installation](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html)
- [SSM Agent setup](https://docs.aws.amazon.com/systems-manager/latest/userguide/ssm-agent.html)

The instance needs outbound access to Systems Manager, ECR, S3 (for ECR layers), and image registries. Attach an instance role with `AmazonSSMManagedInstanceCore` and ECR pull permissions. If using off-instance backups, grant `s3:PutObject` only for the chosen backup prefix and any required KMS permissions. Do not place AWS access keys in application environment files.

Verify through an EC2 terminal or Systems Manager Session Manager:

```bash
sudo systemctl enable --now docker
sudo docker version
sudo docker compose version
aws --version
command -v bash flock tar base64
sudo install -d -m 700 /opt/shsg /opt/shsg/backups /opt/shsg/releases
```

A `t3.micro` has 1 GiB RAM. This is a constrained testing host for four application/database containers. Builds run in GitHub Actions, but runtime memory must still be monitored. Use a larger instance before production traffic. Optional swap can reduce out-of-memory failures during testing, at the cost of disk I/O; first check `free -h`, `df -h`, and `swapon --show`. On a fresh host with sufficient disk and no existing `/swapfile`:

```bash
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
# Add once to /etc/fstab for reboot persistence:
# /swapfile none swap sw 0 0
```

The EC2 security group must allow TCP **9001 and 9002** from your testing IP initially (or intended visitors). Do not open 8000 or 5432. Systems Manager does not need inbound SSH; if using SSH for setup, restrict port 22 to your own IP. Docker publishes the frontend ports directly, so use the EC2 security group rather than relying only on host firewall rules.

## 2. Create production configuration

Copy the contents of [deploy/.env.example](../deploy/.env.example) into `/opt/shsg/.env.production` on EC2. From a checkout on the instance, you can run:

```bash
sudo install -m 600 deploy/.env.example /opt/shsg/.env.production
sudoedit /opt/shsg/.env.production
```

A checkout is optional: create that same file using your EC2 terminal if CI will deliver the deployment files. Replace `ACCOUNT_ID` and both secret placeholders. Generate each secret independently using `openssl rand -hex 32`. Keep the file owned by root with mode `600`. The deployment script supplies the actual registry and commit tag, overriding the example values.

The frontends call the API through Docker DNS (`http://api:8000`); their browser requests use same-origin `/api` routes. No public API port is necessary. The website's Login/Sign up destination is also built into rendered HTML, so changing `SHSG_APP_URL` requires a new image. Update the GitHub repository variables and EC2 configuration together. GitHub Actions cannot read `/opt/shsg/.env.production` on EC2 during an image build; the workflow takes public URLs from Actions variables, while Compose reads runtime settings from the EC2 environment file. CI uses localhost defaults when the variables are unset, but release builds require both variables explicitly.

## 3. Configure ECR and GitHub access

Create private ECR repositories named `shsg-website`, `shsg-app`, and `shsg-api` in `ap-southeast-2`, with immutable tags and image scanning. Images use the full Git commit SHA; retries reuse existing SHA images. Keep previous release images when setting a registry retention policy.

Create a GitHub OIDC provider in IAM and a deployment role restricted to this repository's `production` environment. Use the actual OIDC subject format for your repository: newer GitHub repositories may include immutable owner/repository IDs. Do not copy another repository's trust subject. The audience is `sts.amazonaws.com`. See [GitHub's AWS OIDC setup](https://docs.github.com/en/actions/how-tos/secure-your-work/security-harden-deployments/oidc-in-aws).

The GitHub deployment role needs:

- `ecr:GetAuthorizationToken` on `*`.
- `ecr:DescribeImages`, `ecr:BatchCheckLayerAvailability`, `ecr:InitiateLayerUpload`, `ecr:UploadLayerPart`, `ecr:CompleteLayerUpload`, `ecr:PutImage`, and `ecr:BatchGetImage` scoped to the three ECR repositories.
- `ssm:SendCommand` scoped to the selected EC2 instance and the `AWS-RunShellScript` document.
- `ssm:GetCommandInvocation` for checking the deployment result (this action requires resource `*`).

The EC2 role needs ECR pull permissions (`ecr:GetAuthorizationToken`, `ecr:BatchGetImage`, `ecr:GetDownloadUrlForLayer`, and `ecr:BatchCheckLayerAvailability`) plus the SSM access described above. GitHub pushes images; EC2 only pulls them.

Create a GitHub environment named **production**, restrict its deployment branches to `main`, and add these Actions variables:

| Variable              | Scope                            | Value                                                   |
| --------------------- | -------------------------------- | ------------------------------------------------------- |
| `DEPLOY_ENABLED`      | Repository                       | `true` only after completing setup                      |
| `SHSG_APP_URL`        | Repository                       | `http://15.134.206.246:9002`                            |
| `SHSG_CORS_ORIGINS`   | Repository                       | `http://15.134.206.246:9001,http://15.134.206.246:9002` |
| `AWS_DEPLOY_ROLE_ARN` | production environment           | ARN of the GitHub OIDC deployment role                  |
| `EC2_INSTANCE_ID`     | production environment           | The `i-...` instance ID, not its IP/DNS name            |
| `ECR_REGISTRY`        | production environment           | `ACCOUNT_ID.dkr.ecr.ap-southeast-2.amazonaws.com`       |
| `BACKUP_S3_URI`       | production environment, optional | `s3://YOUR-BUCKET/shsg/backups`                         |

For automatic deployment, do not require a manual reviewer on this environment. Protect `main` with a rule requiring **Required checks** before merge, including administrators if desired. Enabling repository rules and IAM is a one-time external setup; adding a workflow alone does not configure those services.

## 4. Deploy

Push or merge to `main`. CI runs formatting, lint, typechecks, tests, frontend builds, API checks, migration checks, the existing Compose checks, and a complete production-container smoke test. The latter checks both rendered sites, private API connectivity through the frontends, signup, and login against an isolated database.

The production job builds and tests the x86-64 images once and preserves them as a short-lived workflow artifact when deployment is enabled. Only after **Required checks** succeeds does the deployment job publish those exact tested images to ECR and send the reviewed deployment assets to EC2 through Systems Manager. It waits for the remote command result, rather than reporting success merely because AWS accepted the command. Non-main pushes and pull requests never deploy. `DEPLOY_ENABLED` defaults to off when unset.

On EC2 the script:

1. Acquires a deployment lock, authenticates to ECR, and pulls the release images.
2. Starts PostgreSQL and waits for database health.
3. Creates a timestamped `pg_dump` backup in `/opt/shsg/backups`; optionally uploads it to S3. A failed backup/upload blocks the release.
4. Runs a fresh `alembic upgrade head` task, then verifies the database is at the migration heads.
5. Recreates the API and then both frontends, waiting for readiness/HTTP health checks.
6. Records the successful release in `/opt/shsg/current-release`, preserving the previous successful release path in `/opt/shsg/previous-release`.

The migration failure path leaves existing application containers running. A later application startup failure can leave a partially updated release; inspect logs and roll back compatible application images as below. This is a single-instance deployment with possible brief downtime, not blue/green deployment.

Every deployment uses `/opt/shsg/releases/COMMIT_SHA/compose.production.yml` and `/opt/shsg/releases/COMMIT_SHA/deploy.sh`. For a manual retry of a release already transferred by CI:

```bash
sudo bash /opt/shsg/releases/COMMIT_SHA/deploy.sh \
  ap-southeast-2 ACCOUNT_ID.dkr.ecr.ap-southeast-2.amazonaws.com COMMIT_SHA
```

Pass your S3 prefix as the fourth argument if off-instance backups are configured. No server-side `git pull` or manual migration command is needed for routine releases.

## 5. Migrations, backups, and rollback

Create migrations during development with `alembic revision --autogenerate -m "description"`, review them, and commit them with the model change. Production **applies committed migrations**, never generates schema changes automatically. Alembic tracks applied revisions in `alembic_version`; repeated upgrades do not reapply them. Do not edit an already-applied migration.

Use backward-compatible migrations while the old containers are still serving requests: add a column/table first, move application usage, and remove obsolete schema in a later reviewed release. Application rollback does not undo a database migration.

The named volume `shsg-production_postgres_data` persists across container replacement. It does not protect against instance/disk loss. Local pre-deployment backups are not a scheduled disaster-recovery strategy: configure S3 backup uploads, lifecycle retention, scheduled backups between releases, and a tested restore before storing real customer data. Monitor disk space and remove old backups only after verifying off-instance copies. Never run `docker compose down --volumes` against this production stack.

To inspect the current release on EC2, use a root shell:

```bash
sudo -i
cd "$(cat /opt/shsg/current-release)"
docker compose --env-file /opt/shsg/.env.production -f compose.production.yml ps --all
docker compose --env-file /opt/shsg/.env.production -f compose.production.yml logs --tail=100 api website app
```

For a failed deployment, inspect its directory under `/opt/shsg/releases/COMMIT_SHA`; `current-release` still points to the last fully healthy release. Logs are rotated to limit disk growth. Health checks detect readiness; `unless-stopped` restarts exited containers, but Docker does not restart a running process just because its health status is unhealthy.

To roll back application images, first verify the current database is compatible with the target release. From a root shell, select a known healthy directory (use `current-release` if the new release failed, or `previous-release` if the new release completed):

```bash
cd /opt/shsg/releases/KNOWN_HEALTHY_COMMIT_SHA
export IMAGE_TAG=KNOWN_HEALTHY_COMMIT_SHA
docker compose --env-file /opt/shsg/.env.production -f compose.production.yml \
  up --detach --no-deps --wait --wait-timeout 240 api website app
```

This deliberately does not run migrations or downgrade the database. Record the chosen directory in `current-release` after verifying the recovery. A database restore is a separate maintenance operation: stop application writes, restore a verified backup into an isolated database first, and validate before switching traffic.

## Verification before enabling deployment

Confirm the EC2 operating system, Docker/Compose/AWS CLI installation, SSM online status, sufficient memory/disk, environment secrets, ECR repositories, IAM roles, GitHub variables, environment restrictions, and main-branch rules. Then enable `DEPLOY_ENABLED` and merge a tested change. The repository files do not connect to or modify the instance until a configured deployment job or manual command runs.
