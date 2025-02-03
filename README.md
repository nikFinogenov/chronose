# CloOk - Larry & Sergey are jealous

## Project Setup and Usage

This project consists of a **server**, **client**, and a **PostgreSQL database** managed using Docker and Docker Compose.

## Prerequisites
Ensure you have the following installed on your system:
- Docker
- Docker Compose

## Setting Up the `.env` File
Before starting, create an `.env` file in the `server` directory with the following structure:

```dotenv
PORT=8000

DB_HOST=localhost
DB_DIALECT=postgres
DB_PORT=5432

DB_ADMIN_DB=postgres
DB_ADMIN_USER=postgres
DB_ADMIN_PASSWORD=12345678

DB_NAME=db-name
DB_USER=db-user
DB_PASSWORD=password

FRONT_URL=http://localhost:3000
BACK_URL=http://localhost:8000
SECRET_KEY='STRING'
TOKEN_EXPIRES=1h

EMAIL_USER=gase@gmail.com
EMAIL_PASS=0000 0000 0000 0000
```

then create `.env` file in the `client` directory:

```dotenv
REACT_APP_PORT=3000
REACT_APP_API_URL= http://localhost:${REACT_APP_PORT}
```

## Starting the Project

### 1. Build and Start Containers
Run the following script in the `docker` directory to build and start all containers (server, client, and PostgreSQL):

```powershell
./docker-run.sh
```

This script:
- Builds the Docker images for the server and client.

- Starts the containers for the server, client, and PostgreSQL database.

- Loads environment variables from the .env file in the server directory.

### 2. Verify Containers
After running the above command, verify that the containers are running:

```powershell
docker ps
```

### 3. Access the Application

- Frontend: Accessible at http://localhost:3000

- Backend: Accessible at http://localhost:8000

## Stopping the Containers

To stop the containers, use:

```powershell
docker-compose down
```

## Services Overview

### 1. PostgreSQL Database

A PostgreSQL database is used to store application data.
Connection details are defined in the .env file.

### 2. Server

The backend server is built using Node.js and connects to the PostgreSQL database.
Environment variables for the server are configured in the .env file.

### 3. Client
The client application is built with modern front-end frameworks (React).
### Notes

- Ensure your .env file is correctly configured before running the application.

- The default ports are:

  - Frontend: `3000`

  - Backend: `8000`

  - PostgreSQL: `5432`