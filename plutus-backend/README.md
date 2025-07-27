# Plutus Backend

A Go GraphQL server for the Plutus e-commerce platform.

## Environment Variables

This application requires the following environment variables to be set:

### Required Variables

- `NEON_DB_URL`: Your Neon PostgreSQL database connection string
  - Format: `postgresql://username:password@host:port/database`

### Optional Variables

- `PORT`: Server port (defaults to 8090 if not set)

## Deployment on Render

### 1. Create a new Web Service

1. Go to your Render dashboard
2. Click "New +" and select "Web Service"
3. Connect your GitHub repository
4. Select the `plutus-backend` directory as the root directory

### 2. Configure Build Settings

- **Build Command**: `go build -o server .`
- **Start Command**: `./server`

### 3. Set Environment Variables

In your Render service settings, add these environment variables:

1. Go to your service dashboard
2. Click on "Environment" tab
3. Add the following variables:

```
NEON_DB_URL=your_neon_database_connection_string
PORT=10000
```

**Important Notes:**
- Render automatically provides a `PORT` environment variable, but you can override it
- The `NEON_DB_URL` must be your actual Neon database connection string
- Never commit your actual database credentials to the repository

### 4. Deploy

Click "Deploy" and your service should start successfully!

## Local Development

1. Copy `.env.example` to `.env`
2. Fill in your actual database credentials
3. Run `go run server.go`

## API Endpoints

- GraphQL Playground: `/`
- GraphQL Query: `/query`
- Menu API: `/api/menu`
- Search API: `/api/search` 