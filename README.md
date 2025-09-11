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

## Building and Deployment

### Build Profiles

The app has three build profiles configured in `eas.json`:

#### **🔧 Development Profile**
- **Purpose**: Development with Expo Dev Client
- **Output**: Development build for testing
- **Command**: `eas build --platform android --profile development`

#### **📱 Preview Profile** 
- **Purpose**: Internal testing and distribution
- **Output**: **APK file** (can install directly on Android)
- **Command**: `eas build --platform android --profile preview`
- **Use Case**: Testing, internal distribution, direct installation

#### **🚀 Production Profile**
- **Purpose**: Google Play Store submission
- **Output**: **AAB file** (Android App Bundle)
- **Command**: `eas build --platform android --profile production`
- **Use Case**: App Store submission, production deployment

### Build Commands

#### **Android Builds**

```bash
# Development build (with dev client)
eas build --platform android --profile development

# Preview build (APK - for testing)
eas build --platform android --profile preview

# Production build (AAB - for Play Store)
eas build --platform android --profile production

# Build both platforms
eas build --platform all --profile preview
```

#### **iOS Builds**

```bash
# Development build
eas build --platform ios --profile development

# Preview build (simulator)
eas build --platform ios --profile preview

# Production build (App Store)
eas build --platform ios --profile production
```

#### **Build with Custom Options**

```bash
# Build with specific message
eas build --platform android --profile preview --message "Fixed login bug"

# Build with auto-increment version
eas build --platform android --profile production --auto-submit

# Build and submit to store
eas build --platform android --profile production --auto-submit
```

### Over-the-Air Updates (OTA)

For JavaScript/TypeScript changes without rebuilding:

#### **Publish Updates**

```bash
# Preview channel (for testing)
eas update --branch preview --message "Fixed UI bug"

# Production channel (for users)
eas update --branch production --message "Updated API endpoints"

# Using channel instead of branch
eas update --channel preview --message "UI improvements"
eas update --channel production --message "Bug fixes"
```

#### **Update Management**

```bash
# List all updates
eas update:list

# View specific update
eas update:view [update-id]

# Rollback to previous version
eas update:rollback

# Delete specific update
eas update:delete [update-id]
```

#### **What Can Be Updated OTA**

✅ **JavaScript/TypeScript code changes**
✅ **UI/UX updates** 
✅ **Configuration changes**
✅ **Asset updates** (images, fonts)
✅ **API endpoint changes**
✅ **Business logic updates**

❌ **Native dependencies** (new packages)
❌ **Native code changes**
❌ **App permissions**
❌ **App version changes**

### Build Configuration

The app automatically uses the production API URL in builds:
- **Development builds**: Use localhost (if available) or production
- **Production builds**: Always use production API
- **Environment override**: Always respected if set

## Development Workflow

### **Quick Start (Local Development)**

1. **Start Backend**
   ```bash
   cd sales-order-be
   npm run dev
   # Backend runs on http://localhost:4000
   ```

2. **Start Mobile App**
   ```bash
   cd sales-order-app
   npm start
   # App automatically uses localhost API
   ```

### **Testing Workflow**

1. **Make Code Changes**
   - Edit JavaScript/TypeScript files
   - Update UI components
   - Modify API calls

2. **Test Locally**
   ```bash
   # App automatically reloads with changes
   # Test with local backend
   ```

3. **Publish OTA Update** (if no native changes)
   ```bash
   eas update --branch preview --message "Your changes"
   ```

4. **Build New APK** (if native changes)
   ```bash
   eas build --platform android --profile preview
   ```

### **Production Deployment Workflow**

1. **Final Testing**
   ```bash
   # Test with production API
   eas update --branch preview --message "Final testing"
   ```

2. **Deploy to Users**
   ```bash
   # Deploy OTA update
   eas update --branch production --message "Production release"
   ```

3. **App Store Submission** (if needed)
   ```bash
   # Build AAB for Play Store
   eas build --platform android --profile production
   
   # Submit to store
   eas submit --platform android
   ```

### **Common Workflows**

#### **Bug Fix (JavaScript only)**
```bash
# 1. Fix the bug in code
# 2. Test locally
npm start

# 3. Deploy fix
eas update --branch production --message "Fixed login bug"
```

#### **New Feature (UI only)**
```bash
# 1. Implement feature
# 2. Test locally
npm start

# 3. Deploy feature
eas update --branch production --message "Added new feature"
```

#### **New Native Dependency**
```bash
# 1. Install new package
npm install new-package

# 2. Build new APK
eas build --platform android --profile preview

# 3. Test new APK
# 4. Deploy to production
eas build --platform android --profile production
```

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

### **API Issues**

1. **API calls failing in development**
   - Ensure backend is running: `cd sales-order-be && npm run dev`
   - Check if backend is accessible: `curl http://localhost:4000/api/health`

2. **API calls failing in production build**
   - Check if production API is accessible: `curl https://sales-order-backend.vercel.app/api/health`
   - Verify environment variables in EAS dashboard

3. **Authentication errors**
   - Ensure `X-Agent-Email` header is being sent
   - Check if user is logged in with valid email
   - Verify email ends with `@fairbanc.app`

4. **Data not syncing**
   - Check network connectivity
   - Verify API responses in browser dev tools
   - Check backend logs in Vercel dashboard

### **Build Issues**

1. **Build fails with dependency error**
   ```bash
   # Clear cache and rebuild
   eas build --platform android --profile preview --clear-cache
   ```

2. **APK not installing on device**
   - Check if device allows unknown sources
   - Verify APK is not corrupted (re-download)
   - Try different device or emulator

3. **AAB file not accepted by Play Store**
   - Ensure using production profile: `eas build --platform android --profile production`
   - Check app signing configuration
   - Verify version code is incremented

4. **Build takes too long**
   - Check EAS build queue: https://expo.dev/accounts/[username]/projects/[project]/builds
   - Consider upgrading EAS plan for faster builds
   - Use `--clear-cache` if build seems stuck

### **OTA Update Issues**

1. **Update not showing in app**
   - Check if update was published to correct branch/channel
   - Verify app is not in development mode (`__DEV__ = false`)
   - Check update status: `eas update:list`

2. **Update fails to download**
   - Check network connectivity
   - Verify update was published successfully
   - Try force refresh: `eas update --branch production --message "Force refresh"`

3. **App crashes after update**
   - Check update logs: `eas update:view [update-id]`
   - Rollback to previous version: `eas update:rollback`
   - Test update in preview channel first

### **Development Issues**

1. **App not connecting to localhost**
   - Ensure backend is running on port 4000
   - Check if using correct API configuration
   - Verify no firewall blocking localhost

2. **Hot reload not working**
   - Restart development server: `npm start`
   - Clear Metro cache: `npx expo start --clear`
   - Check for syntax errors in code

3. **Build profile not working**
   - Verify `eas.json` configuration
   - Check if profile exists: `eas build:configure`
   - Use correct profile name in commands

### **Debug Mode**

Enable debug logging by setting environment variable:
```bash
# For development
EXPO_PUBLIC_DEBUG=true

# For builds
eas build --platform android --profile preview --env EXPO_PUBLIC_DEBUG=true
```

### **Useful Commands**

```bash
# Check EAS status
eas whoami

# List all builds
eas build:list

# View build logs
eas build:view [build-id]

# List updates
eas update:list

# Check project configuration
eas project:info

# Clear all caches
eas build --platform android --profile preview --clear-cache
```

## Quick Reference

### **Most Common Commands**

```bash
# Local development
npm start

# Build APK for testing
eas build --platform android --profile preview

# Build AAB for Play Store
eas build --platform android --profile production

# Deploy OTA update
eas update --branch production --message "Bug fix"

# Check build status
eas build:list

# Check update status
eas update:list
```

### **File Formats Explained**

| Format | Use Case | Command | Install Method |
|--------|----------|---------|----------------|
| **APK** | Testing, Direct install | `--profile preview` | Direct installation |
| **AAB** | Google Play Store | `--profile production` | Play Store only |
| **OTA** | Code updates | `eas update` | Automatic in app |

### **Build Profiles Summary**

| Profile | Output | Use Case | Command |
|---------|--------|----------|---------|
| `development` | Dev build | Development | `--profile development` |
| `preview` | APK | Testing | `--profile preview` |
| `production` | AAB | App Store | `--profile production` |

### **Update Channels**

| Channel | Purpose | Command |
|---------|---------|---------|
| `preview` | Testing updates | `--branch preview` |
| `production` | User updates | `--branch production` |

## Target Users

This app is designed for:
- **Sales Representatives**: Who work with multiple warung outlets
- **Field Sales Teams**: Who need mobile tools for order management
- **Payment Collectors**: Who collect payments from various outlets
- **Outlet Managers**: Who register and manage outlet information

## License
MIT