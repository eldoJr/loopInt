FROM node:20-alpine

WORKDIR /app

# Install NestJS CLI globally
RUN npm install -g @nestjs/cli

# Copy API package files
COPY apps/api/package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY apps/api ./

# Create uploads directory
RUN mkdir -p uploads/team

# Build the application
RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start:dev"]