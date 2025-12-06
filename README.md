# Home Library Service

## Prerequisites

- Git - [Download & Install Git](https://git-scm.com/downloads).
- Node.js - [Download & Install Node.js](https://nodejs.org/en/download/) (version 24.10.0 or higher) and the npm package manager (version 10.9.2 or higher).
- Docker & Docker Compose - [Download & Install Docker](https://docs.docker.com/engine/install/).

## Downloading

```bash
git clone https://github.com/soljahd/nodejs2025Q2-service.git
cd nodejs2025Q2-service
```

## Environment Configuration

Create a `.env` file in the root directory (copy from .env.example):

```bash
cp .env.example .env
```

## Running Application

### Option 1: Docker Deployment (Recommended)

#### Prerequisites

- Docker installed on your system
- Docker Compose (usually included with Docker Desktop)

#### Running with Docker Compose

**First-time setup:**

```bash
# Build images and start all services (attached mode - see logs)
docker-compose up --build

# Or start in background (detached mode)
docker-compose up -d --build
```

**Stopping Services:**

```bash
# Stop running containers without removing them
docker-compose stop

# Stop specific services
docker-compose stop app
docker-compose stop postgres

# Stop and remove containers, networks (preserves volumes)
docker-compose down

# Stop and remove everything including volumes (WARNING: deletes database!)
docker-compose down -v

# Force stop (SIGKILL)
docker-compose kill
```

**Starting Services:**

```bash
# Start all services from existing configuration
docker-compose start

# Start specific services only
docker-compose start app
docker-compose start postgres

# Start services and rebuild if necessary
docker-compose up --build

# Start in detached mode (background)
docker-compose up -d
```

**Restarting Services:**

```bash
# Restart all services
docker-compose restart

# Restart specific services
docker-compose restart app
docker-compose restart postgres

# Stop and start again (clean restart)
docker-compose down && docker-compose up -d

# Recreate containers (useful for configuration changes)
docker-compose up --force-recreate
```

#### Docker Services Architecture

The application consists of two services:

1. **PostgreSQL Database** (`postgres` service)
   - Port: 5432 (mapped from .env DB_PORT)
   - Data persisted in Docker volume
   - Pre-configured with music_db database

2. **NestJS Application** (`app` service)
   - Port: 4000 (mapped from .env PORT)
   - Automatically connects to PostgreSQL
   - Hot-reload enabled in development
   - OpenAPI documentation at `/doc`

#### Environment Variables for Docker

The application uses environment variables from `.env` file:

- `PORT` - Application port (default: 4000)
- `DB_USER` - PostgreSQL username (default: postgres)
- `DB_PASSWORD` - PostgreSQL password (default: postgres)
- `DB_NAME` - Database name (default: music_db)
- `DB_PORT` - PostgreSQL port (default: 5432)
- `DATABASE_URL` - Automatically constructed in docker-compose

#### Docker Development Workflow

For development with Docker, the app service mounts the local `./src` directory, allowing live code updates without rebuilding the container.

### Option 2: Local Development (Without Docker)

#### Installing NPM modules

```bash
npm ci
```

#### Database Setup

Ensure you have PostgreSQL running locally or update the `.env` file with your database connection details.

#### Running the application

```bash
# Production mode
npm start

# Development mode
npm run start:dev
```

After starting the app on port (4000 as default) you can open
in your browser OpenAPI documentation by typing http://localhost:4000/doc.

## Testing

### Running Tests

```bash
# Run all tests
npm run test

# Run specific test suite
npm run test -- <path/to/test/file>
```

## Code Quality

### Linting

```bash
npm run lint
```

### Code Formatting

```bash
npm run format
```

### Building for Production

```bash
npm run build
```

### Docker Security Scanning for vulnerabilities

```bash
# Scan database image
npm run docker:scan:db

# Scan application image
npm run docker:scan:app
```

## Application Structure

```
src/
├── albums/          # Album module (entities, DTOs, services, controllers)
├── artists/         # Artist module
├── tracks/          # Track module
├── users/           # User module
├── favorites/       # Favorites module
├── shared/          # Shared utilities and services
├── prisma/          # Database ORM configuration
└── app.module.ts    # Main application module
```

## Features

- **RESTful API** with proper HTTP status codes
- **Input validation** using class-validator
- **UUID validation** for all ID parameters
- **OpenAPI documentation** automatically generated
- **Database integration** with PostgreSQL and Prisma ORM
- **Password hashing** for secure user authentication
- **Cascading deletions** - when entities are deleted, references are properly handled
- **Favorites management** - with proper validation of existing entities

## Notes

- **Hot Reload**: The Docker setup supports hot reloading for development
- **Database Persistence**: PostgreSQL data is persisted in Docker volumes
- **Environment Variables**: All configuration is managed through `.env` file
- **API Documentation**: Swagger UI available at http://localhost:4000/doc
- **Health Check**: Root endpoint provides service health status

## Troubleshooting

### Common Issues

1. **Port already in use**: Change `PORT` in `.env` file
2. **Database connection errors**:
   - Ensure PostgreSQL is running (if not using Docker)
   - Check database credentials in `.env`
   - Verify Docker containers are running: `docker-compose ps`
3. **Docker build failures**:
   - Clear Docker cache: `docker-compose build --no-cache`
   - Check Docker daemon is running

### Docker Commands for Maintenance

```bash
# Clean up Docker resources
docker-compose down -v  # Removes volumes too
docker system prune -a  # Cleans all unused Docker objects

# Check container status
docker-compose ps

# Access PostgreSQL container
docker-compose exec postgres psql -U postgres -d music_db

# View application logs
docker-compose logs app
```

## API Documentation

Once running, access the full API documentation at:

- Swagger UI: http://localhost:4000/doc
