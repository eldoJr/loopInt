# loopInt
Workflow loops and intelligence - all-in-one platform for project management system

## Architecture

This is a modern monorepo built with:
- **Frontend**: React 19 + Vite + TypeScript
- **Backend**: NestJS + TypeORM
- **Database**: PostgreSQL
- **Styling**: TailwindCSS + Framer Motion
- **Monorepo**: Turborepo for build orchestration
- **Containerization**: Docker + Docker Compose
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
- Docker & Docker Compose

### Quick Start

```bash
git clone https://github.com/eldoJr/loopInt
cd loopInt
npm run docker:dev
```

Access:
- Frontend: http://localhost:5173
- Backend: http://localhost:3000

### Docker Commands

```bash
npm run docker:dev   # Start development (auto-installs dependencies)
npm run docker:down  # Stop services
npm run docker:logs  # View logs
```

Docker automatically installs all dependencies for both API and Web applications.



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
