# NOC - Network Operations Center

NOC is a project that utilizes Object-Oriented Programming (OOP) with Clean Architecture principles. It provides a framework for monitoring web pages and generating logs of different severity levels based on the state of the fetched URL. This README provides an overview of the project, its setup, and key components.

## Features

- Utilizes a cron timer to execute jobs for monitoring web pages.
- Generates log files with different severity levels: low, medium, and high.
- Supports configuration for development and testing environments.
- Emailing integration to send the logs.
- Utilizes three data sources to save logs: MongoDB, FileSystem, and PostgreSQL using Prisma ORM.

## Installation

To install the project and its dependencies, run the following command:

```bash
npm install
```

## Environment variables
The project relies on several environment variables for configuration. Make sure to create two .env files, one for development and one for testing, with the following variables:

- **PORT**: The port on which the project will run (default is 3000).
- **MAILER_SERVICE**: The email service provider (e.g., Gmail) for sending notifications.
- **MAILER_EMAIL**: The email address used for sending notifications.
- **MAILER_SECRET_KEY**: The secret key or credentials for the email service.
- **PROD**: A flag indicating whether the project is running in production (true or false).

### MongoDB Configuration:
- **MONGO_URL**: The URL to the MongoDB database.
- **MONGO_DB_NAME**: The name of the MongoDB database (e.g., "NOC").
- **MONGO_USER**: The username for MongoDB authentication.
- **MONGO_PASS**: The password for MongoDB authentication.

### PostgreSQL Configuration:
- **POSTGRES_USER**: The username for the PostgreSQL database.
- **POSTGRES_PASSWORD**: The password for the PostgreSQL database.
- **POSTGRES_DB**: The name of the PostgreSQL database (e.g., "NOC").
- **POSTGRES_URL**: The URL to the PostgreSQL database.

### Prisma Database Configuration:
- **DATABASE_URL**: The connection URL for the Prisma ORM to connect to the PostgreSQL database.


## Setting datasources
The project provides Docker Compose files for both production and testing environments. You can use them to set up the necessary containers for your project.

- docker-compose.production.yml for production.
- docker-compose.test.yml for testing.