# 📚 Documentation

This directory contains additional documentation and assets for the Warung Order App project.

## 📁 Directory Structure

```
docs/
├── README.md              # This file
├── images/                # Images and screenshots
│   ├── screenshots/       # App screenshots
│   ├── mockups/          # App mockups and demos
│   └── logos/            # Logos and branding
├── setup/                 # Setup guides
└── api/                   # API documentation
```

## 📸 Image Guidelines

### Screenshots

**Recommended specifications:**
- **Format**: PNG or JPEG
- **Resolution**: 1080x1920 (9:16) for mobile screenshots
- **Quality**: High quality, clear and readable
- **File size**: Keep under 1MB for GitHub

**Naming convention:**
```
feature-name-screen.png
feature-name-screen-dark.png (for dark mode)
feature-name-screen-ios.png (platform specific)
```

### Mockups

**Recommended specifications:**
- **Format**: PNG with transparency
- **Resolution**: 1200x800 or higher
- **Style**: Consistent with app design
- **Content**: Show key features clearly

### Logos

**Recommended specifications:**
- **Format**: SVG (preferred) or PNG
- **Size**: 200x200px minimum
- **Background**: Transparent
- **Style**: Consistent branding

## 🎨 Creating Screenshots

### Using Expo Development Tools

1. **Start the app:**
   ```bash
   npm start
   ```

2. **Open on device/simulator:**
   ```bash
   npm run ios    # iOS Simulator
   npm run android # Android Emulator
   ```

3. **Take screenshots:**
   - **iOS Simulator**: Cmd + S
   - **Android Emulator**: Ctrl + S
   - **Physical device**: Use device screenshot function

### Using Expo Snack (for web screenshots)

1. **Open Expo Snack:**
   - Go to [snack.expo.dev](https://snack.expo.dev)
   - Import your project

2. **Take web screenshots:**
   - Use browser developer tools
   - Set mobile viewport
   - Take screenshots

## 📱 Recommended Screenshots

### Essential Screenshots

1. **Home Screen** - Product catalog with banner
2. **Product Detail** - Individual product view
3. **Cart Screen** - Shopping cart with items
4. **Checkout Screen** - Order confirmation
5. **History Screen** - Transaction history
6. **Settings Screen** - App preferences

### Feature Screenshots

1. **Credit Limit** - Available credit display
2. **Search Function** - Product search
3. **Language Switch** - Multi-language support
4. **Dark Mode** - Dark theme (if implemented)

### Platform Screenshots

- **iOS**: iPhone 14 Pro (1179x2556)
- **Android**: Pixel 7 (1080x2400)
- **Web**: Desktop browser (1920x1080)

## 🔧 Image Optimization

### Before Uploading

1. **Compress images:**
   ```bash
   # Using ImageOptim (macOS)
   # Or TinyPNG (online)
   # Or squoosh.app (Google)
   ```

2. **Resize if needed:**
   ```bash
   # Using ImageMagick
   convert screenshot.png -resize 1080x1920^ screenshot-resized.png
   ```

3. **Check file size:**
   ```bash
   ls -lh docs/images/screenshots/
   ```

### GitHub Optimization

- Use relative paths in README
- Keep images under 1MB
- Use descriptive alt text
- Consider using GitHub's image CDN

## 📋 Image Checklist

Before adding images to README:

- [ ] Images are high quality and clear
- [ ] File sizes are reasonable (< 1MB)
- [ ] Naming follows convention
- [ ] Alt text is descriptive
- [ ] Images show key features
- [ ] Screenshots are up-to-date
- [ ] Multiple platforms covered (if applicable)

## 🚀 Quick Setup

```bash
# Create image directories
mkdir -p docs/images/{screenshots,mockups,logos}

# Take screenshots and add them
# Then update README.md with image references
```

## 📞 Support

For help with images or documentation:
- Check this guide
- Review existing images for examples
- Ask in GitHub Discussions 