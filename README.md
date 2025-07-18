# loopInt
Workflow loops and intelligence - all-in-one platform for project management system

## Architecture

This is a modern monorepo built with:
- **Frontend**: React 19 + Vite + TypeScript
- **Backend**: NestJS + TypeORM
- **Database**: PostgreSQL
- **Styling**: TailwindCSS + Framer Motion
- **Monorepo**: Turborepo for build orchestration
- **Caching**: Redis

## Project Structure

```
loopInt/
├── apps/
│   ├── web/          # React frontend
│   └── api/          # NestJS backend
├── packages/
│   ├── ui/           # Shared UI components
│   └── utils/        # Shared utilities
├── docker/           # Docker configuration
└── docker-compose.yml
```



## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL (local installation or remote access)
- Redis (optional, for caching)

### Quick Start

```bash
# Clone the repository
git clone https://github.com/eldoJr/loopInt
cd loopInt

# Install dependencies
npm install

# Start development servers
npm run dev
```

Access:
- Frontend: http://localhost:5173
- Backend: http://localhost:3000

### Database Setup

Ensure you have PostgreSQL running and update the connection details in:
- `/apps/api/.env`

The project is currently configured to use an AWS RDS instance. You can either:
1. Continue using the remote database (if you have access)
2. Set up a local PostgreSQL instance and update the connection details



## Features

- Project & Task Management
- Team Collaboration
- Calendar Integration
- Client & Financial Tracking
- Document Management
- Analytics & Reporting
- AI-powered features



## License

Private and proprietary.
