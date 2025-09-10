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
1. **Environment Override**: If `EXPO_PUBLIC_API_URL` is set, it uses that URL
2. **Development Mode**: If running in development (`__DEV__`), it uses localhost
3. **Production Mode**: Otherwise, it defaults to the production Vercel URL

## Development vs Production

### Development Mode (`npm start`)
- **API URL**: `http://localhost:4000/api`
- **Requires**: Backend running locally (`npm run dev` in backend directory)
- **Use Case**: Local development and testing

### Production Mode (`eas build`)
- **API URL**: `https://sales-order-backend.vercel.app/api`
- **Requires**: No local backend needed
- **Use Case**: Production builds and app store releases

## Testing

- **Local**: Backend must be running on `http://localhost:4000`
- **Production**: Uses the live Vercel deployment
