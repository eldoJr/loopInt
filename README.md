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
│   ├── web/                     # React frontend (Vite + TypeScript)
│   │   ├── src/
│   │   │   ├── components/      # Reusable UI components
│   │   │   │   ├── ui/          # Base UI components
│   │   │   │   ├── layout/      # Layout components
│   │   │   │   ├── forms/       # Form components
│   │   │   │   ├── cards/       # Card components
│   │   │   │   └── chat/        # Chat components
│   │   │   ├── features/        # Feature-specific components
│   │   │   │   ├── auth/        # Authentication
│   │   │   │   ├── projects/    # Project management
│   │   │   │   ├── tasks/       # Task management
│   │   │   │   ├── team/        # Team management
│   │   │   │   ├── calendar/    # Calendar functionality
│   │   │   │   ├── clients/     # Client management
│   │   │   │   ├── finance/     # Financial features
│   │   │   │   ├── hr/          # HR management
│   │   │   │   ├── reports/     # Reporting system
│   │   │   │   ├── analytics/   # Analytics dashboard
│   │   │   │   ├── ai/          # AI-powered features
│   │   │   │   ├── documents/   # Document management
│   │   │   │   ├── profile/     # User profile
│   │   │   │   ├── settings/    # Application settings
│   │   │   │   └── support/     # Help & support
│   │   │   ├── pages/           # Main application pages
│   │   │   ├── lib/             # Utility libraries
│   │   │   ├── context/         # React contexts
│   │   │   ├── hooks/           # Custom React hooks
│   │   │   └── store/           # State management
│   │   └── package.json
│   └── api/                     # NestJS backend API
│       ├── src/
│       │   ├── tasks/           # Task management module
│       │   ├── projects/        # Project management module
│       │   ├── team/            # Team management module
│       │   ├── calendar/        # Calendar module
│       │   ├── app.module.ts    # Main application module
│       │   ├── app.controller.ts
│       │   ├── auth.controller.ts
│       │   └── main.ts
│       ├── test/                # E2E tests
│       ├── uploads/             # File uploads storage
│       └── package.json
├── packages/
│   ├── ui/                      # Shared UI components (@loopint/ui)
│   └── utils/                   # Shared utilities (@loopint/utils)
├── services/
│   ├── ai/                      # AI services (planned)
│   ├── crm/                     # CRM logic (planned)
│   ├── tasks/                   # Task automation (planned)
│   └── auth/                    # Authentication services (planned)
├── docker/
│   ├── nginx/                   # Nginx configuration
│   ├── postgres/                # PostgreSQL setup
│   ├── api.Dockerfile           # API container
│   ├── web.Dockerfile           # Web container
│   └── start-*.sh               # Docker startup scripts
├── scripts/                     # Utility scripts
├── tests/                       # Global tests
├── docker-compose.yml           # Multi-container setup
├── turbo.json                   # Turborepo configuration
└── package.json                 # Root package configuration
```

## Tech Stack

### Frontend (React App)
- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite 6
- **Styling**: TailwindCSS 3.4
- **Animations**: Framer Motion 12
- **Icons**: Lucide React
- **Routing**: React Router DOM 7
- **Charts**: Recharts 3
- **State Management**: React Context + Hooks
- **Form Handling**: Custom form components
- **Authentication**: Custom auth system

### Backend (NestJS API)
- **Framework**: NestJS 11
- **Database ORM**: TypeORM 0.3
- **Database**: PostgreSQL
- **File Upload**: Multer
- **Authentication**: bcryptjs
- **Environment**: dotenv
- **Testing**: Jest + Supertest
- **Validation**: Built-in NestJS pipes

### Infrastructure
- **Containerization**: Docker + Docker Compose
- **Reverse Proxy**: Nginx
- **Caching**: Redis 7
- **Database**: PostgreSQL 15
- **Monorepo**: Turborepo 1.10
- **Package Manager**: npm workspaces

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Docker & Docker Compose (optional)

### Development Setup

1. **Clone and install dependencies:**
   ```bash
   git clone <repository-url>
   cd loopInt
   npm install
   ```

2. **Environment setup:**
   ```bash
   # Copy environment files
   cp .env.example .env
   cp apps/web/.env.local.example apps/web/.env.local
   
   # Edit with your values
   nano .env
   nano apps/web/.env.local
   ```

3. **Start development servers:**
   ```bash
   # Start all services
   npm run dev
   
   # Or start individually
   cd apps/web && npm run dev    # Frontend on http://localhost:5173
   cd apps/api && npm run start:dev  # Backend on http://localhost:3000
   ```

### Docker Development

```bash
# Start with Docker Compose
npm run docker:dev

# Or manually
docker compose --profile development up -d

# View logs
npm run docker:logs

# Stop services
npm run docker:down
```

### Available Scripts

```bash
# Development
npm run dev          # Start all apps in development
npm run build        # Build all apps
npm run test         # Run all tests
npm run lint         # Lint all code

# Database (when Prisma is configured)
npm run db:generate  # Generate Prisma client
npm run db:push      # Push schema changes
npm run db:migrate   # Run migrations
npm run db:studio    # Open Prisma Studio

# Docker
npm run docker:dev   # Start development environment
npm run docker:full  # Start full production environment
npm run docker:up    # Start containers
npm run docker:down  # Stop containers
npm run docker:logs  # View container logs
```

## Features

### Core Functionality
- 🏢 **Project Management**: Create, manage, and track projects
- ✅ **Task Management**: Advanced task creation and tracking
- 👥 **Team Collaboration**: Team member management and collaboration
- 📅 **Calendar Integration**: Schedule meetings and manage events
- 👤 **User Authentication**: Secure login and registration
- 📊 **Analytics Dashboard**: Project and task analytics

### Business Features
- 🏢 **Client Management**: Company and contact management
- 💰 **Financial Tracking**: Bills, expenses, and revenue tracking
- 📄 **Document Management**: File uploads and document handling
- 🎯 **HR Management**: Job postings, candidates, and HR projects
- 📈 **Reporting System**: Generate and manage reports
- 🤖 **AI Integration**: AI-powered task and report generation

### Technical Features
- 🎨 **Modern UI/UX**: Clean, responsive design with dark mode
- 🔄 **Real-time Updates**: Live data synchronization
- 📱 **Mobile Responsive**: Works on all device sizes
- 🔐 **Secure**: Authentication and authorization
- 🚀 **Performance**: Optimized build and caching
- 🐳 **Containerized**: Docker support for easy deployment

## API Endpoints

The backend provides RESTful APIs for:
- `/api/tasks` - Task management
- `/api/projects` - Project management  
- `/api/team` - Team member management
- `/api/calendar` - Calendar events
- `/auth` - Authentication endpoints

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Submit a pull request

## License

This project is private and proprietary.
