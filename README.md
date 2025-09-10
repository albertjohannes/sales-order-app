# Sales Order App

A comprehensive sales application designed for salespeople to manage orders and collect payments on behalf of warungs (small shops) in Indonesia. This app enables sales representatives to browse products, place orders for outlets, and collect payments with QR code authorization.

## Overview

This sales app serves as a mobile tool for salespeople who work with multiple warung outlets. It allows them to:

- **Browse Products**: View catalog with filtering by brand
- **Order on Behalf**: Place orders for specific outlets
- **Payment Collection**: Collect payments from outlets with QR authorization
- **Transaction Management**: Track order history and payment status
- **Outlet Onboarding**: Register new outlets with location and photo data
- **Backend Integration**: Real-time data sync with production API

## Key Features

### 🛒 **Order Management**
- Browse and filter products by brand
- Add items to cart with quantity management
- Place orders on behalf of specific outlets
- View order history and transaction details

### 💰 **Payment Collection**
- Select outlet and invoice for payment collection
- Scan QR codes from Warung Adil app for authorization
- Manual authorization code entry as fallback
- Real-time validation of authorization codes
- Transaction confirmation and success tracking

### 🏪 **Outlet Onboarding**
- Register new outlets with complete information
- Location data with province, regency, district, village
- Photo capture for KTP, outside, inside, and inventory
- GPS coordinates and postal code support

### 📱 **User Experience**
- Multi-language support (Bahasa Indonesia & English)
- Progressive disclosure workflow
- Real-time validation and feedback
- Clean, intuitive interface for sales workflow
- **Smart API Detection**: Automatically uses local or production backend

## Backend Integration

### API Configuration

The app intelligently determines which backend to use:

#### **Development Mode** (`npm start`)
- **API URL**: `http://localhost:4000/api`
- **Requires**: Backend running locally
- **Command**: `cd sales-order-be && npm run dev`
- **Use Case**: Local development and testing

#### **Production Mode** (`eas build`)
- **API URL**: `https://sales-order-backend.vercel.app/api`
- **Requires**: No local backend needed
- **Use Case**: Production builds and app store releases

#### **Environment Override**
- **Variable**: `EXPO_PUBLIC_API_URL`
- **Override**: Any URL (local, staging, production)
- **File**: `.env.local` in project root
- **Example**: `EXPO_PUBLIC_API_URL=https://staging-api.vercel.app/api`

### Authentication

All API calls use header-based authentication:
- **Header**: `X-Agent-Email`
- **Value**: User's email address
- **Required**: For all authenticated endpoints
- **Automatic**: Handled by `useApi` hook

### API Endpoints

#### Health Check
- **GET** `/api/health` - No authentication required

#### Onboarding
- **POST** `/api/onboarding` - Create new outlet registration
- **GET** `/api/onboarding` - List all outlets for agent
- **GET** `/api/onboarding?id=uuid` - Get specific outlet

#### Collection
- **POST** `/api/collection` - Record payment collection
- **GET** `/api/collection` - List all collections for agent
- **GET** `/api/collection?id=uuid` - Get specific collection
- **GET** `/api/collection?outletId=outlet-123` - Get collections by outlet

## Project Structure

```
sales-order-app/
├── app/                    # App screens and navigation
│   ├── (tabs)/            # Main tab screens
│   ├── onboarding/        # Outlet registration screens
│   ├── collection/        # Payment collection screens
│   └── login.tsx          # Authentication screen
├── components/            # Reusable UI components
│   ├── ApiTestComponent.tsx # API testing component
│   └── ui/               # UI components
├── contexts/             # React contexts
│   └── AuthContext.tsx   # Authentication context
├── services/             # API services
│   └── api.ts           # Centralized API calls
├── config/              # Configuration
│   └── api.ts          # API URL configuration
├── assets/              # Images and fonts
├── constants/           # App-wide constants
├── hooks/               # Custom React hooks
├── data/                # Mock data (fallback)
└── package.json         # Project dependencies
```

## Development Setup

### Prerequisites
- Node.js 18+
- Expo CLI
- EAS CLI (for builds)
- Backend running locally (for development)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd sales-order-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm start
   ```

### Backend Setup

For local development, you need the backend running:

1. **Clone backend repository**
   ```bash
   git clone <backend-repository-url>
   cd sales-order-be
   ```

2. **Install backend dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your Supabase credentials
   ```

4. **Start backend server**
   ```bash
   npm run dev
   # Backend will run on http://localhost:4000
   ```

### Environment Configuration

Create `.env.local` in the mobile app root for custom API URLs:

```bash
# For local development (optional - auto-detected)
EXPO_PUBLIC_API_URL=http://localhost:4000/api

# For staging/testing
EXPO_PUBLIC_API_URL=https://staging-api.vercel.app/api

# For production (optional - auto-detected)
EXPO_PUBLIC_API_URL=https://sales-order-backend.vercel.app/api
```

## Building for Production

### EAS Build

1. **Configure EAS**
   ```bash
   eas build:configure
   ```

2. **Build for Android**
   ```bash
   eas build --platform android
   ```

3. **Build for iOS**
   ```bash
   eas build --platform ios
   ```

### Build Configuration

The app automatically uses the production API URL in builds:
- **Development builds**: Use localhost (if available) or production
- **Production builds**: Always use production API
- **Environment override**: Always respected if set

## API Testing

### Using the App
1. **Login** with any email address
2. **Test Onboarding** - Create new outlet registrations
3. **Test Collection** - Record payment collections
4. **Check History** - Verify data sync with backend

### Using Postman
Import the Postman collection from `sales-order-be/postman/`:
- **Local Environment**: `http://localhost:4000`
- **Production Environment**: `https://sales-order-backend.vercel.app`

### Using curl
```bash
# Health check
curl https://sales-order-backend.vercel.app/api/health

# Test with authentication
curl -H "X-Agent-Email: test@example.com" \
     https://sales-order-backend.vercel.app/api/onboarding
```

## Troubleshooting

### Common Issues

1. **API calls failing in development**
   - Ensure backend is running: `cd sales-order-be && npm run dev`
   - Check if backend is accessible: `curl http://localhost:4000/api/health`

2. **API calls failing in production build**
   - Check if production API is accessible: `curl https://sales-order-backend.vercel.app/api/health`
   - Verify environment variables in EAS dashboard

3. **Authentication errors**
   - Ensure `X-Agent-Email` header is being sent
   - Check if user is logged in with valid email

4. **Data not syncing**
   - Check network connectivity
   - Verify API responses in browser dev tools
   - Check backend logs in Vercel dashboard

### Debug Mode

Enable debug logging by setting environment variable:
```bash
EXPO_PUBLIC_DEBUG=true
```

## Target Users

This app is designed for:
- **Sales Representatives**: Who work with multiple warung outlets
- **Field Sales Teams**: Who need mobile tools for order management
- **Payment Collectors**: Who collect payments from various outlets
- **Outlet Managers**: Who register and manage outlet information

## License
MIT