FROM node:20-alpine

WORKDIR /app

# Copy Web package files
COPY apps/web/package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY apps/web ./

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]