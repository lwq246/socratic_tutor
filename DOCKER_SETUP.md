# Docker Setup Guide

This guide will help you run the Socratic Tutor application using Docker.

## Prerequisites

- Docker Desktop installed and running
- Docker Compose (usually included with Docker Desktop)

## Quick Start

### 1. Build and Start All Services

```bash
docker-compose up --build
```

This will start:

- **Next.js App** on `http://localhost:3000`
- **MongoDB** on `localhost:27017`
- **Ollama** on `localhost:11434`

### 2. Set Up Ollama Models

After the containers are running, you need to pull the required Ollama models:

```bash
# Pull the chat model
docker exec -it socratic-tutor-ollama-1 ollama pull sutor

# Pull the embedding model
docker exec -it socratic-tutor-ollama-1 ollama pull nomic-embed-text
```

**Note:** Replace `socratic-tutor-ollama-1` with your actual Ollama container name. You can find it with:

```bash
docker ps
```

### 3. Access the Application

Open your browser and navigate to: `http://localhost:3000`

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# MongoDB Configuration
# For Docker: mongodb://mongodb:27017/SocraticTutor
# For MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/SocraticTutor
MONGODB_URI=mongodb://mongodb:27017/SocraticTutor

# Ollama Configuration
# For Docker: http://ollama:11434
OLLAMA_BASE_URL=http://ollama:11434

# Next.js Configuration
NODE_ENV=production
```

## Running Individual Services

### Start services in detached mode:

```bash
docker-compose up -d
```

### Stop all services:

```bash
docker-compose down
```

### Stop and remove volumes (clean slate):

```bash
docker-compose down -v
```

### View logs:

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f app
docker-compose logs -f mongodb
docker-compose logs -f ollama
```

## Building Only the App

If you only want to build the Next.js app without MongoDB and Ollama:

```bash
docker build -t socratic-tutor .
docker run -p 3000:3000 \
  -e MONGODB_URI=your_mongodb_uri \
  -e OLLAMA_BASE_URL=your_ollama_url \
  socratic-tutor
```

## Troubleshooting

### Docker Daemon Not Running

If you see an error like `failed to connect to the docker API`, it means Docker Desktop is not running:

**Windows:**

1. Open Docker Desktop from the Start menu
2. Wait for it to fully start (you'll see a whale icon in the system tray)
3. Verify it's running: `docker ps` should work without errors

**Verify Docker is running:**

```bash
docker ps
```

If this command works, Docker is running. If you get an error, start Docker Desktop first.

### Port Already in Use

If port 3000, 27017, or 11434 is already in use, modify the ports in `docker-compose.yml`:

```yaml
ports:
  - "3001:3000" # Change 3000 to 3001
```

### Models Not Found

Make sure you've pulled the required Ollama models. Check if they're available:

```bash
docker exec -it socratic-tutor-ollama-1 ollama list
```

### MongoDB Connection Issues

Ensure MongoDB is running and accessible. Check logs:

```bash
docker-compose logs mongodb
```

### Rebuild After Code Changes

After making code changes, rebuild the app:

```bash
docker-compose up --build app
```

## Production Deployment

For production, consider:

1. Using environment-specific `.env` files
2. Setting up proper MongoDB authentication
3. Using managed MongoDB (MongoDB Atlas) instead of containerized MongoDB
4. Setting up proper volume backups for Ollama models
5. Using a reverse proxy (nginx) in front of the app
6. Setting up SSL/TLS certificates
