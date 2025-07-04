#!/usr/bin/env node

/**
 * Warung Order App - Screenshot Helper Script
 * 
 * This script helps organize and manage screenshots for the README.
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
  docsDir: path.join(process.cwd(), 'docs'),
  imagesDir: path.join(process.cwd(), 'docs', 'images'),
  screenshotsDir: path.join(process.cwd(), 'docs', 'images', 'screenshots'),
  mockupsDir: path.join(process.cwd(), 'docs', 'images', 'mockups'),
  logosDir: path.join(process.cwd(), 'docs', 'images', 'logos')
};

// Required screenshots
const requiredScreenshots = [
  'home-screen.png',
  'cart-screen.png', 
  'history-screen.png',
  'settings-screen.png',
  'product-detail-screen.png',
  'checkout-screen.png'
];

// Optional screenshots
const optionalScreenshots = [
  'credit-limit-screen.png',
  'search-screen.png',
  'language-switch-screen.png',
  'dark-mode-screen.png'
];

function createDirectories() {
  logStep('Creating Image Directories...');
  
  const dirs = [
    config.docsDir,
    config.imagesDir,
    config.screenshotsDir,
    config.mockupsDir,
    config.logosDir
  ];
  
  for (const dir of dirs) {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      logSuccess(`Created: ${dir}`);
    } else {
      logInfo(`Exists: ${dir}`);
    }
  }
}

function createScreenshotGuide() {
  logStep('Creating Screenshot Guide...');
  
  const guideContent = `# 📸 Screenshot Guide

## Required Screenshots

These screenshots are essential for the README:

${requiredScreenshots.map(screenshot => `- [ ] ${screenshot}`).join('\n')}

## Optional Screenshots

These screenshots enhance the documentation:

${optionalScreenshots.map(screenshot => `- [ ] ${screenshot}`).join('\n')}

## How to Take Screenshots

### iOS Simulator
1. Start the app: \`npm run ios\`
2. Navigate to the screen you want to capture
3. Press \`Cmd + S\` to take screenshot
4. Screenshot will be saved to Desktop
5. Move to: \`docs/images/screenshots/\`

### Android Emulator
1. Start the app: \`npm run android\`
2. Navigate to the screen you want to capture
3. Press \`Ctrl + S\` to take screenshot
4. Screenshot will be saved to Desktop
5. Move to: \`docs/images/screenshots/\`

### Physical Device
1. Run the app on your device
2. Navigate to the screen you want to capture
3. Take screenshot using device function
4. Transfer to computer
5. Move to: \`docs/images/screenshots/\`

## Image Requirements

- **Format**: PNG or JPEG
- **Resolution**: 1080x1920 (9:16) for mobile
- **Quality**: High quality, clear and readable
- **File size**: Keep under 1MB
- **Naming**: Use the exact names listed above

## After Taking Screenshots

1. Move screenshots to \`docs/images/screenshots/\`
2. Optimize images if needed (compress, resize)
3. Update README.md with image references
4. Test that images display correctly on GitHub

## Image Optimization Tools

- **Online**: TinyPNG, Squoosh.app
- **macOS**: ImageOptim
- **Windows**: FileOptimizer
- **Linux**: ImageMagick

## Example README Update

After adding screenshots, update the README.md:

\`\`\`markdown
### Main Features

- **Home**: Product catalog with banner carousel
  ![Home Screen](docs/images/screenshots/home-screen.png)
  
- **Cart**: Shopping cart with quantity management
  ![Cart Screen](docs/images/screenshots/cart-screen.png)
  
- **History**: Transaction history and receipts
  ![History Screen](docs/images/screenshots/history-screen.png)
  
- **Settings**: Language and app preferences
  ![Settings Screen](docs/images/screenshots/settings-screen.png)
\`\`\`
`;
  
  const guidePath = path.join(config.docsDir, 'screenshot-guide.md');
  fs.writeFileSync(guidePath, guideContent);
  logSuccess(`Created: ${guidePath}`);
}

function checkExistingScreenshots() {
  logStep('Checking Existing Screenshots...');
  
  const allScreenshots = [...requiredScreenshots, ...optionalScreenshots];
  const existingScreenshots = fs.existsSync(config.screenshotsDir) 
    ? fs.readdirSync(config.screenshotsDir) 
    : [];
  
  logInfo('Required Screenshots:');
  for (const screenshot of requiredScreenshots) {
    if (existingScreenshots.includes(screenshot)) {
      logSuccess(`  ✅ ${screenshot}`);
    } else {
      logWarning(`  ❌ ${screenshot} (missing)`);
    }
  }
  
  logInfo('\nOptional Screenshots:');
  for (const screenshot of optionalScreenshots) {
    if (existingScreenshots.includes(screenshot)) {
      logSuccess(`  ✅ ${screenshot}`);
    } else {
      logInfo(`  ⚪ ${screenshot} (optional)`);
    }
  }
  
  return existingScreenshots;
}

function createImageOptimizationScript() {
  logStep('Creating Image Optimization Script...');
  
  const scriptContent = `#!/bin/bash

# Image Optimization Script for Warung Order App
# This script helps optimize images for GitHub

SCREENSHOTS_DIR="docs/images/screenshots"
OPTIMIZED_DIR="docs/images/optimized"

# Create optimized directory
mkdir -p "$OPTIMIZED_DIR"

echo "🖼️  Optimizing images..."

# Check if ImageOptim is available (macOS)
if command -v imageoptim &> /dev/null; then
    echo "Using ImageOptim..."
    imageoptim "$SCREENSHOTS_DIR"/*.png
    imageoptim "$SCREENSHOTS_DIR"/*.jpg
    imageoptim "$SCREENSHOTS_DIR"/*.jpeg
elif command -v convert &> /dev/null; then
    echo "Using ImageMagick..."
    for file in "$SCREENSHOTS_DIR"/*.{png,jpg,jpeg}; do
        if [ -f "$file" ]; then
            filename=$(basename "$file")
            convert "$file" -quality 85 "$OPTIMIZED_DIR/$filename"
            echo "Optimized: $filename"
        fi
    done
else
    echo "⚠️  No optimization tools found."
    echo "Please install ImageOptim (macOS) or ImageMagick"
    echo "Or use online tools like TinyPNG or Squoosh.app"
fi

echo "✅ Image optimization complete!"
echo "Optimized images are in: $OPTIMIZED_DIR"
`;
  
  const scriptPath = path.join(process.cwd(), 'scripts', 'optimize-images.sh');
  fs.writeFileSync(scriptPath, scriptContent);
  
  // Make executable
  try {
    execSync(`chmod +x "${scriptPath}"`, { stdio: 'pipe' });
    logSuccess(`Created: ${scriptPath}`);
  } catch (error) {
    logWarning(`Created: ${scriptPath} (make executable manually)`);
  }
}

function showNextSteps(existingScreenshots) {
  logStep('Next Steps');
  
  const missingRequired = requiredScreenshots.filter(
    screenshot => !existingScreenshots.includes(screenshot)
  );
  
  if (missingRequired.length > 0) {
    logWarning('Missing Required Screenshots:');
    missingRequired.forEach(screenshot => {
      log(`  - ${screenshot}`);
    });
    
    logInfo('\nTo take screenshots:');
    log('  1. Start the app: npm start');
    log('  2. Open on simulator/device');
    log('  3. Navigate to each screen');
    log('  4. Take screenshots');
    log('  5. Move to docs/images/screenshots/');
  } else {
    logSuccess('All required screenshots are present!');
  }
  
  logInfo('\n📚 Documentation:');
  log('  - Screenshot guide: docs/screenshot-guide.md');
  log('  - Image guidelines: docs/README.md');
  
  logInfo('\n🔧 Optimization:');
  log('  - Run: ./scripts/optimize-images.sh');
  log('  - Or use online tools: TinyPNG, Squoosh.app');
  
  logInfo('\n📝 Update README:');
  log('  - Add image references to README.md');
  log('  - Test on GitHub');
  log('  - Check image quality and file sizes');
}

function main() {
  log(`${colors.bright}${colors.cyan}📸 Warung Order App - Screenshot Helper${colors.reset}\n`);
  
  try {
    createDirectories();
    createScreenshotGuide();
    createImageOptimizationScript();
    
    const existingScreenshots = checkExistingScreenshots();
    showNextSteps(existingScreenshots);
    
    logSuccess('\n🎉 Screenshot setup completed!');
    
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
  createDirectories,
  createScreenshotGuide,
  checkExistingScreenshots
}; 