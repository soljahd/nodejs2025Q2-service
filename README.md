# Home Library Service

## Prerequisites

- Git - [Download & Install Git](https://git-scm.com/downloads).
- Node.js - [Download & Install Node.js](https://nodejs.org/en/download/) (version 24.10.0 or higher) and the npm package manager (version 10.9.2 or higher).

## Downloading

```bash
git clone https://github.com/soljahd/nodejs2025Q2-service.git
cd nodejs2025Q2-service
```

## Installing NPM modules

```bash
npm ci
```

## Environment Configuration

Create a `.env` file in the root directory (copy from .env.example):

```bash
cp .env.example .env
```

## Running application

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

## Application Structure

```
src/
├── albums/          # Album module (entities, DTOs, services, controllers)
├── artists/         # Artist module
├── tracks/          # Track module
├── users/           # User module
├── favorites/       # Favorites module
├── shared/          # Shared utilities and services
└── app.module.ts    # Main application module
```

## Features

- **RESTful API** with proper HTTP status codes
- **Input validation** using class-validator
- **UUID validation** for all ID parameters
- **OpenAPI documentation** automatically generated
- **In-memory data storage** (ready for database integration)
- **Cascading deletions** - when entities are deleted, references are properly handled
- **Password protection** - passwords are excluded from API responses
- **Favorites management** - with proper validation of existing entities

## Notes

- The service uses in-memory storage (will be replaced with database in future tasks)
- All IDs must be valid UUID v4 format
- Passwords are never returned in API responses
- When entities are deleted, all references are properly cleaned up
- Non-existing entities cannot be added to favorites
