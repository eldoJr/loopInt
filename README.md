# loopInt
Workflow loops and intelligence - all-in-one platform for project management system

## Architecture

This is a modern monorepo built with:
- **Frontend**: React/Next.js
- **Backend**: NestJS
- **Database**: PostgreSQL with Prisma
- **AI Integration**: OpenAI services
- **Monorepo**: Turborepo for build orchestration

## Structure

```
loopInt/
├── apps/
│   ├── web/                     # React frontend app
│   └── api/                     # NestJS backend API
├── packages/
│   ├── ui/                      # Shared UI components
│   └── utils/                   # Shared utilities
├── services/
│   ├── ai/                      # AI services
│   ├── crm/                     # CRM logic
│   ├── tasks/                   # Task automation
│   └── auth/                    # Authentication
├── prisma/                      # Database schema
└── docker/                      # Docker configurations
```

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment:
   ```bash
   cp .env .env.local
   # Edit .env.local with your values
   ```

3. Start development:
   ```bash
   npm run dev
   ```

## Features

- 🔄 Workflow automation and loops
- 🤖 AI-powered task management
- 📊 CRM integration with auto-tagging
- 🎯 Smart task prioritization
- 🔐 Secure authentication
- 📱 Responsive web interface
