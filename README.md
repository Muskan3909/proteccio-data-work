<div align="center">
  <img src="https://img.shields.io/badge/Proteccio-Data-0ea5e9?style=for-the-badge&logo=github&logoColor=white" alt="Proteccio Data" />
  <h1>Proteccio Data</h1>
  <p>
    <strong>Local development and deployment repository for the Proteccio application stack.</strong>
  </p>
</div>

Proteccio Data brings together the frontend, backend, database, object storage, and infrastructure services needed to run the project locally and reliably.

<div align="center">

[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=flat-square&logo=docker&logoColor=white)](https://docs.docker.com/compose/)
[![React](https://img.shields.io/badge/React-Vite-61DAFB?style=flat-square&logo=react&logoColor=black)](https://vite.dev/)
[![Express](https://img.shields.io/badge/Express-Backend-000000?style=flat-square&logo=express&logoColor=white)](https://expressjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-4169E1?style=flat-square&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![MinIO](https://img.shields.io/badge/MinIO-Storage-C72E49?style=flat-square&logo=minio&logoColor=white)](https://min.io/)

</div>

## Overview

This repository contains the core services used by Proteccio:

- Frontend: React + Vite + TypeScript
- Backend: Express + TypeScript
- Database: PostgreSQL
- Storage: MinIO (S3-compatible object storage)
- Reverse proxy: Nginx
- Orchestration: Docker Compose

<div align="center">

## Quick start

</div>

### Prerequisites

- Docker Desktop or Docker Engine
- Docker Compose
- Ports 3000, 5000, 9000, and 9001 available

### Start the stack

```bash
cd proteccio-data
docker compose up -d --build
```

### Check services

```bash
docker compose ps
```

### Access the app

- Frontend: http://localhost:5000
- Backend API: http://localhost:3000
- MinIO console: http://localhost:9001

Default MinIO credentials:

- Username: `minioadmin`
- Password: `minioadmin`

## Repository structure

```text
proteccio-data/
├── .env.example
├── docker-compose.yaml
├── README.md
├── DOCKER_SETUP.md
├── nginx/
├── scripts/
├── security/
├── proteccio-backend/
├── proteccio-frontend/
├── proteccio-frontend-safety-backup/
├── src/
├── add-org-columns.sql
├── add-project-currency-budget.sql
└── manage.sh
```

## Useful commands

### Stop services

```bash
docker compose down
```

### Stop and remove data volumes

```bash
docker compose down -v
```

### View logs

```bash
docker compose logs -f backend
docker compose logs -f frontend
```

## Environment configuration

Copy the example environment file before running the application:

```bash
cp .env.example .env
```

Then update values such as database credentials, app URLs, and storage settings as needed.

## Troubleshooting

- If a port is already in use, stop the conflicting container with `docker ps` and then `docker stop <container-name>`.
- If the app still shows stale content after updates, hard-refresh the browser and confirm you are using `/proteccio/...` paths.
- If backend errors appear after reusing an old database volume, check container logs and run the required migrations.

<div align="center">

## Documentation

</div>

- [DOCKER_SETUP.md](DOCKER_SETUP.md)
- [SETUP_THE_PROJECT.md](SETUP_THE_PROJECT.md)
- [proteccio-backend/README.md](proteccio-backend/README.md)
- [proteccio-frontend/README.md](proteccio-frontend/README.md)

## License

This project is distributed under the AGPL-3.0 license. See [LICENSE](LICENSE) for details.

## Contributing

Contributions are welcome. Please keep the project aligned with the repository's existing structure and local Docker workflow when proposing changes.

### Prerequisites

- Docker Desktop or Docker Engine
- Docker Compose
- Ports 3000, 5000, 9000, and 9001 available

### Start the stack

```bash
cd proteccio-data
docker compose up -d --build
```

### Check services

```bash
docker compose ps
```

### Access the app

- Frontend: http://localhost:5000
- Backend API: http://localhost:3000
- MinIO console: http://localhost:9001

Default MinIO credentials:

- Username: `minioadmin`
- Password: `minioadmin`

## Useful commands

### Stop services

```bash
docker compose down
```

### Stop and remove data volumes

```bash
docker compose down -v
```

### View logs

```bash
docker compose logs -f backend
docker compose logs -f frontend
```

## Environment configuration

Copy the example environment file before running the application:

```bash
cp .env.example .env
```

Then update values such as database credentials, app URLs, and storage settings as needed.

## Troubleshooting

- If a port is already in use, stop the conflicting container with `docker ps` and then `docker stop <container-name>`.
- If the app still shows stale content after updates, hard-refresh the browser and confirm you are using `/proteccio/...` paths.
- If backend errors appear after reusing an old database volume, check container logs and run the required migrations.

## Documentation

- [DOCKER_SETUP.md](DOCKER_SETUP.md)
- [SETUP_THE_PROJECT.md](SETUP_THE_PROJECT.md)
- [proteccio-backend/README.md](proteccio-backend/README.md)
- [proteccio-frontend/README.md](proteccio-frontend/README.md)

## License

This project is distributed under the AGPL-3.0 license. See [LICENSE](LICENSE) for details.

## Contributing

Contributions are welcome. Please keep the project aligned with the repository's existing structure and local Docker workflow when proposing changes.
