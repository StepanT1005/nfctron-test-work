# NFCTRON TEST WORK

## Overview

This is a simple customer management API built using NestJS, TypeScript, and PostgreSQL. The application provides endpoints to manage customers, including creating, reading, updating, and deleting customer records.

## Prerequisites

- Node.js 18+
- pnpm (installed globally)
- Docker & Docker Compose

## Getting Started

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/StepanT1005/nfctron-test-work.git
   cd nfctron-test-work
   ```

2. Install dependencies:

   ```bash
   pnpm install
   ```

### Environment Variables

Create a `.env` file in the root directory and add the following variables:

```plaintext
DB_HOST=db
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=yourpassword
DB_NAME=customer_management
PORT=3000
```

### Running the Application

#### Using Docker

1. Build and start the application:

   ```bash
   docker-compose up --build
   ```

2. The application will be available at `http://localhost:3000`.

#### Without Docker

1. Start the PostgreSQL database (if not using Docker).

2. Start the application:

   ```bash
   pnpm run start:dev
   ```

### API Documentation

Swagger documentation is automatically generated and available at:

```
http://localhost:3000/api
```

### Testing

To run the unit tests:

```bash
pnpm run test
```

### Project Structure

- **src/app.module.ts**: The root module of the application.
- **src/app.controller.ts**: The controller responsible for handling HTTP requests.
- **src/data/data.module.ts**: The module responsible for data management.
- **src/data/data.service.ts**: The service that simulates database operations.
- **src/data/dto/**: Data Transfer Objects used for validation and data transfer.
- **src/data/customer.entity.ts**: The entity representing a customer.
