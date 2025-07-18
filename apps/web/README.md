# LoopInt Web Frontend

This is the frontend application for LoopInt, a workflow and intelligence platform for project management.

## Running in Static Mode

The application has been configured to run in static mode without requiring the backend API. This is useful for development and testing purposes.

### Static Admin Credentials

Use these credentials to log in:
- **Email**: admin@loopint.com
- **Password**: admin123

### Starting the Frontend

```bash
# Navigate to the web directory
cd apps/web

# Install dependencies
npm install

# Start the development server
npm run dev
```

The application will be available at http://localhost:5173

## Features Available in Static Mode

- Login with static admin credentials
- Dashboard with mock data
- Projects view with mock data
- Tasks view with mock data
- Team view with mock data

## Notes

- All backend API calls have been replaced with static mock data
- Form submissions will not persist data between sessions
- Social login buttons are disabled in static mode