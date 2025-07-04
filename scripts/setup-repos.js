#!/usr/bin/env node

/**
 * Warung Order App - Repository Setup Script
 * 
 * This script helps set up and manage public and private repositories
 * for the Warung Order App project.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSuccess(message) {
  log(`✅ ${message}`, 'green');
}

function logError(message) {
  log(`❌ ${message}`, 'red');
}

function logWarning(message) {
  log(`⚠️  ${message}`, 'yellow');
}

function logInfo(message) {
  log(`ℹ️  ${message}`, 'blue');
}

function logStep(message) {
  log(`\n${colors.cyan}${colors.bright}${message}${colors.reset}`);
}

// Configuration
const config = {
  privateRepoName: 'warung-order-app-private',
  publicRepoName: 'warung-order-app-public',
  currentDir: process.cwd(),
  parentDir: path.dirname(process.cwd())
};

// File patterns to exclude from public repo
const privateFiles = [
  'data/credentials.ts',
  '.env',
  '.env.local',
  '.env.production',
  'secrets/',
  'keys/'
];

// File patterns to include in public repo
const publicFiles = [
  'app/',
  'components/',
  'contexts/',
  'hooks/',
  'constants/',
  'assets/',
  'services/',
  'data/mockData.ts',
  'data/translations.ts',
  'package.json',
  'tsconfig.json',
  'eslint.config.js',
  'README.md',
  '.gitignore',
  'app.json'
];

function checkPrerequisites() {
  logStep('Checking Prerequisites...');
  
  // Check if git is installed
  try {
    execSync('git --version', { stdio: 'pipe' });
    logSuccess('Git is installed');
  } catch (error) {
    logError('Git is not installed. Please install Git first.');
    process.exit(1);
  }

  // Check if node is installed
  try {
    execSync('node --version', { stdio: 'pipe' });
    logSuccess('Node.js is installed');
  } catch (error) {
    logError('Node.js is not installed. Please install Node.js first.');
    process.exit(1);
  }

  // Check if npm is installed
  try {
    execSync('npm --version', { stdio: 'pipe' });
    logSuccess('npm is installed');
  } catch (error) {
    logError('npm is not installed. Please install npm first.');
    process.exit(1);
  }
}

function createDirectory(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    logSuccess(`Created directory: ${dirPath}`);
  } else {
    logInfo(`Directory already exists: ${dirPath}`);
  }
}

function copyFile(source, destination) {
  try {
    const destDir = path.dirname(destination);
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }
    
    fs.copyFileSync(source, destination);
    logSuccess(`Copied: ${source} → ${destination}`);
  } catch (error) {
    logError(`Failed to copy ${source}: ${error.message}`);
  }
}

function copyDirectory(source, destination) {
  try {
    if (!fs.existsSync(destination)) {
      fs.mkdirSync(destination, { recursive: true });
    }

    const items = fs.readdirSync(source);
    
    for (const item of items) {
      const sourcePath = path.join(source, item);
      const destPath = path.join(destination, item);
      
      if (fs.statSync(sourcePath).isDirectory()) {
        copyDirectory(sourcePath, destPath);
      } else {
        copyFile(sourcePath, destPath);
      }
    }
  } catch (error) {
    logError(`Failed to copy directory ${source}: ${error.message}`);
  }
}

function createPublicRepo() {
  logStep('Creating Public Repository...');
  
  const publicRepoPath = path.join(config.parentDir, config.publicRepoName);
  
  // Create public repo directory
  createDirectory(publicRepoPath);
  
  // Copy files to public repo
  for (const filePattern of publicFiles) {
    const sourcePath = path.join(config.currentDir, filePattern);
    const destPath = path.join(publicRepoPath, filePattern);
    
    if (fs.existsSync(sourcePath)) {
      if (fs.statSync(sourcePath).isDirectory()) {
        copyDirectory(sourcePath, destPath);
      } else {
        copyFile(sourcePath, destPath);
      }
    }
  }
  
  // Create .env.example for public repo
  const envExampleContent = `# ========================================
# WARUNG ORDER APP - ENVIRONMENT VARIABLES (PUBLIC)
# ========================================

# API Configuration
EXPO_PUBLIC_API_BASE_URL=https://api.example.com
EXPO_PUBLIC_MOCK_MODE=true

# App Configuration
EXPO_PUBLIC_APP_NAME=Warung Order App
EXPO_PUBLIC_APP_VERSION=1.0.0
EXPO_PUBLIC_DEFAULT_LANGUAGE=id

# Feature Flags
EXPO_PUBLIC_ENABLE_ANALYTICS=false
EXPO_PUBLIC_ENABLE_CRASH_REPORTING=false
EXPO_PUBLIC_DEBUG_MODE=false

# Development Settings
EXPO_PUBLIC_DEV_SERVER_URL=http://localhost:8081
EXPO_PUBLIC_HOT_RELOAD=true

# Optional Settings
EXPO_PUBLIC_API_TIMEOUT=30000
EXPO_PUBLIC_CACHE_DURATION=3600
EXPO_PUBLIC_MAX_RETRIES=3

# ========================================
# NOTES
# ========================================
# This is a demo version with mock data only.
# No real API credentials are included.
`;
  
  fs.writeFileSync(path.join(publicRepoPath, '.env.example'), envExampleContent);
  logSuccess('Created .env.example for public repo');
  
  // Update README for public repo
  const publicReadmePath = path.join(publicRepoPath, 'README.md');
  if (fs.existsSync(publicReadmePath)) {
    let readmeContent = fs.readFileSync(publicReadmePath, 'utf8');
    readmeContent = readmeContent.replace(
      '## 🔐 Security',
      `## 🔐 Security

### Demo Version
This is a **demo/showcase version** of Warung Order App with the following characteristics:
- ✅ **Mock data only** - No real API integration
- ✅ **Safe for public viewing** - No sensitive credentials
- ✅ **Full UI/UX demonstration** - Complete user interface
- ✅ **Educational purposes** - Perfect for portfolio/showcase

### Private Version
The full implementation with real API integration is available in a private repository.`
    );
    fs.writeFileSync(publicReadmePath, readmeContent);
    logSuccess('Updated README for public repo');
  }
  
  // Initialize git in public repo
  try {
    execSync('git init', { cwd: publicRepoPath, stdio: 'pipe' });
    logSuccess('Initialized git in public repo');
  } catch (error) {
    logError(`Failed to initialize git: ${error.message}`);
  }
  
  logSuccess(`Public repository created at: ${publicRepoPath}`);
  return publicRepoPath;
}

function createPrivateRepo() {
  logStep('Creating Private Repository...');
  
  const privateRepoPath = path.join(config.parentDir, config.privateRepoName);
  
  // Create private repo directory
  createDirectory(privateRepoPath);
  
  // Copy all files to private repo
  const items = fs.readdirSync(config.currentDir);
  
  for (const item of items) {
    const sourcePath = path.join(config.currentDir, item);
    const destPath = path.join(privateRepoPath, item);
    
    if (fs.statSync(sourcePath).isDirectory()) {
      copyDirectory(sourcePath, destPath);
    } else {
      copyFile(sourcePath, destPath);
    }
  }
  
  // Create .env.example for private repo
  const envExampleContent = `# ========================================
# WARUNG ORDER APP - ENVIRONMENT VARIABLES (PRIVATE)
# ========================================

# API Configuration
EXPO_PUBLIC_API_BASE_URL=https://sandbox.partner.app/api
EXPO_PUBLIC_MOCK_MODE=false

# App Configuration
EXPO_PUBLIC_APP_NAME=Warung Order App
EXPO_PUBLIC_APP_VERSION=1.0.0
EXPO_PUBLIC_DEFAULT_LANGUAGE=id

# Feature Flags
EXPO_PUBLIC_ENABLE_ANALYTICS=false
EXPO_PUBLIC_ENABLE_CRASH_REPORTING=false
EXPO_PUBLIC_DEBUG_MODE=false

# Development Settings
EXPO_PUBLIC_DEV_SERVER_URL=http://localhost:8081
EXPO_PUBLIC_HOT_RELOAD=true

# ========================================
# API CREDENTIALS (ADD YOUR REAL VALUES)
# ========================================
EXPO_PUBLIC_OUTLET_ID=your_outlet_id_here
EXPO_PUBLIC_DISTRIBUTOR_ID=your_distributor_id_here
EXPO_PUBLIC_API_TOKEN=your_api_token_here

# ========================================
# OPTIONAL SETTINGS
# ========================================
EXPO_PUBLIC_API_TIMEOUT=30000
EXPO_PUBLIC_CACHE_DURATION=3600
EXPO_PUBLIC_MAX_RETRIES=3

# ========================================
# SECURITY NOTES
# ========================================
# 1. Never commit this file with real credentials
# 2. Use .env.local for local development
# 3. Use environment variables in production
# 4. Keep credentials secure and rotate regularly
`;
  
  fs.writeFileSync(path.join(privateRepoPath, '.env.example'), envExampleContent);
  logSuccess('Created .env.example for private repo');
  
  // Initialize git in private repo
  try {
    execSync('git init', { cwd: privateRepoPath, stdio: 'pipe' });
    logSuccess('Initialized git in private repo');
  } catch (error) {
    logError(`Failed to initialize git: ${error.message}`);
  }
  
  logSuccess(`Private repository created at: ${privateRepoPath}`);
  return privateRepoPath;
}

function showNextSteps(publicRepoPath, privateRepoPath) {
  logStep('Next Steps');
  
  logInfo('Public Repository Setup:');
  log(`  1. Navigate to: ${publicRepoPath}`);
  log(`  2. Create GitHub repository: ${config.publicRepoName}`);
  log(`  3. Add remote: git remote add origin https://github.com/yourusername/${config.publicRepoName}.git`);
  log(`  4. Install dependencies: npm install`);
  log(`  5. Copy .env.example to .env and configure for demo mode`);
  log(`  6. Test the app: npm start`);
  log(`  7. Commit and push: git add . && git commit -m "Initial public demo" && git push -u origin main`);
  
  logInfo('\nPrivate Repository Setup:');
  log(`  1. Navigate to: ${privateRepoPath}`);
  log(`  2. Create private GitHub repository: ${config.privateRepoName}`);
  log(`  3. Add remote: git remote add origin https://github.com/yourusername/${config.privateRepoName}.git`);
  log(`  4. Install dependencies: npm install`);
  log(`  5. Copy .env.example to .env and add your real API credentials`);
  log(`  6. Test the app: npm start`);
  log(`  7. Commit and push: git add . && git commit -m "Initial private setup" && git push -u origin main`);
  
  logWarning('\n⚠️  Important Security Notes:');
  log('  - Never commit .env files with real credentials');
  log('  - Keep your private repository secure');
  log('  - Use different API credentials for different environments');
  log('  - Regularly rotate your API tokens');
  
  logInfo('\n📚 Useful Commands:');
  log('  - npm start          # Start development server');
  log('  - npm run ios        # Run on iOS simulator');
  log('  - npm run android    # Run on Android emulator');
  log('  - npm run web        # Run on web browser');
  log('  - npm run lint       # Run code linting');
}

function main() {
  log(`${colors.bright}${colors.cyan}🏪 Warung Order App - Repository Setup${colors.reset}\n`);
  
  try {
    checkPrerequisites();
    
    const publicRepoPath = createPublicRepo();
    const privateRepoPath = createPrivateRepo();
    
    showNextSteps(publicRepoPath, privateRepoPath);
    
    logSuccess('\n🎉 Repository setup completed successfully!');
    
  } catch (error) {
    logError(`Setup failed: ${error.message}`);
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  main();
}

module.exports = {
  createPublicRepo,
  createPrivateRepo,
  checkPrerequisites
}; 