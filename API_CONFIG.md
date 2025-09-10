# API Configuration

## Environment Variables

Create a `.env.local` file in the project root for environment-specific configuration:

```bash
# For production builds
EXPO_PUBLIC_API_URL=https://sales-order-backend.vercel.app/api

# For local development (optional - defaults to localhost)
# EXPO_PUBLIC_API_URL=http://localhost:4000/api
```

## Current Configuration

- **Development**: `http://localhost:4000/api` (when backend is running locally)
- **Production**: `https://sales-order-backend.vercel.app/api` (Vercel deployment)

## How It Works

The app automatically detects the environment:
1. If `EXPO_PUBLIC_API_URL` is set, it uses that URL
2. Otherwise, it defaults to the production Vercel URL
3. For local development, start the backend with `npm run dev` in the backend directory

## Testing

- **Local**: Backend must be running on `http://localhost:4000`
- **Production**: Uses the live Vercel deployment
