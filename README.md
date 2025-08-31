# WorkForce Navigator

Mappls-powered platform for field workforce operations management.

## Project Structure

This is a monorepo containing:

- `packages/frontend` - React web application
- `packages/backend` - Node.js API server
- `packages/shared` - Shared TypeScript types and utilities

## Development Setup

### Prerequisites

- Node.js 18+
- npm 9+
- Docker (optional, for containerized development)

### Quick Start

1. Install dependencies:

```bash
npm install
```

2. Start development servers:

```bash
npm run dev
```

This will start:

- Backend API server on http://localhost:3001
- Frontend development server on http://localhost:3000

### Individual Package Development

```bash
# Backend only
npm run dev:backend

# Frontend only
npm run dev:frontend
```

### Docker Development

```bash
# Start all services with Docker
docker-compose -f docker-compose.dev.yml up

# Production build
docker-compose up --build
```

## Available Scripts

- `npm run dev` - Start both frontend and backend in development mode
- `npm run build` - Build all packages
- `npm run test` - Run tests for all packages
- `npm run lint` - Lint all code
- `npm run format` - Format code with Prettier

## Environment Variables

Copy `packages/backend/.env.example` to `packages/backend/.env` and configure:

- JWT_SECRET
- ETHEREUM_RPC_URL
- MAPPLS_API_KEY
- Database connections
- External service credentials

## Architecture

The application follows a microservices architecture with:

- **Frontend**: React with Material-UI, Leaflet maps, WebSocket connections
- **Backend**: Express.js with TypeScript, Socket.io for real-time features
- **Blockchain**: Ethereum integration for audit trails
- **External APIs**: Mappls for mapping and geolocation services

## Features

- Real-time workforce tracking
- Geofenced attendance management
- Job assignment optimization
- Route optimization
- Digital timesheets
- Expense automation
- Blockchain audit trails
