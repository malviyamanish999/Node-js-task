# Tasks API

A robust Nest.js REST API for task management with JWT authentication, PostgreSQL database integration, and Swagger documentation.

## Features

- **CRUD Operations**: Create, read, update, and delete tasks
- **Authentication**: JWT-based authentication system
- **Pagination**: Efficient pagination for task listing
- **Soft Delete**: Tasks are soft-deleted for data integrity
- **Database**: PostgreSQL with TypeORM
- **Validation**: Request data validation using class-validator
- **Documentation**: Interactive API documentation with Swagger
- **Testing**: Unit tests for services

## Tech Stack

- **Framework**: Nest.js
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: TypeORM
- **Authentication**: JWT (JSON Web Tokens)
- **Documentation**: Swagger/OpenAPI
- **Validation**: class-validator, class-transformer

## Prerequisites

- Node.js (v18 or higher)
- PostgreSQL database
- npm or yarn

## Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Set up PostgreSQL database and create a database named `tasks_db`

4. Configure environment variables by creating a `.env` file in the root directory:
```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME="DB_USERNAME"
DB_PASSWORD="DB_PASSWORD"
DB_DATABASE="DB_DATABASE"
PORT=5000
```

## Running the Application

```bash
# Development mode
npm run start:dev

# Production mode
npm run start:prod
```

The API will be available at `http://localhost:5000`

## API Documentation

Once the application is running, visit `http://localhost:5000/api` to access the interactive Swagger documentation.

## API Endpoints

### Authentication

- `POST /auth/login` - Login with username and password
  - **Body**: `{ "username": "admin", "password": "admin123" }`
  - **Response**: `{ "access_token": "...", "user": { "id": 1, "username": "admin" } }`

**Dummy Users:**
- Username: `admin`, Password: `admin123`
- Username: `user`, Password: `user123`

### Tasks (Protected - requires JWT token)

- `GET /tasks` - Get all tasks with pagination
  - **Query params**: `page` (default: 1), `limit` (default: 10)
  - **Headers**: `Authorization: Bearer <token>`

- `GET /tasks/:id` - Get a specific task by ID
  - **Headers**: `Authorization: Bearer <token>`

- `POST /tasks` - Create a new task
  - **Body**: `{ "title": "Task title", "description": "Task description", "status": "pending" }`
  - **Headers**: `Authorization: Bearer <token>`

- `PATCH /tasks/:id` - Update a task
  - **Body**: `{ "title": "Updated title", "status": "completed" }`
  - **Headers**: `Authorization: Bearer <token>`

- `DELETE /tasks/:id` - Soft delete a task
  - **Headers**: `Authorization: Bearer <token>`

## Task Status

- `pending` - Task is pending
- `in_progress` - Task is in progress
- `completed` - Task is completed

## Testing

```bash
# Unit tests
npm run test

# Test coverage
npm run test:cov

# E2E tests
npm run test:e2e
```

## Project Structure

```
src/
├── auth/
│   ├── dto/
│   │   └── login.dto.ts
│   ├── guards/
│   │   └── jwt-auth.guard.ts
│   ├── strategies/
│   │   └── jwt.strategy.ts
│   ├── auth.controller.ts
│   ├── auth.module.ts
│   ├── auth.service.ts
│   └── auth.service.spec.ts
├── tasks/
│   ├── dto/
│   │   ├── create-task.dto.ts
│   │   ├── update-task.dto.ts
│   │   └── pagination.dto.ts
│   ├── entities/
│   │   └── task.entity.ts
│   ├── tasks.controller.ts
│   ├── tasks.module.ts
│   ├── tasks.service.ts
│   └── tasks.service.spec.ts
├── app.controller.ts
├── app.module.ts
├── app.service.ts
└── main.ts
```

## License

MIT
