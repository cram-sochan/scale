# 🎸 Triangle Scale Visualizer

A Progressive Web App (PWA) and Native Mobile App for visualizing and practicing scales on Bass, Guitar, and Piano. Install it on your phone and use it offline!

**Available as:**
- 🌐 **Web App (PWA)** - Install from browser, works offline
- 📱 **Android App** - Native Android app for Google Play Store  
- 🍎 **iOS App** - Native iOS app for App Store

![PWA](https://img.shields.io/badge/PWA-Enabled-667eea?style=flat-square)
![Mobile](https://img.shields.io/badge/Mobile-Friendly-667eea?style=flat-square)
![Capacitor](https://img.shields.io/badge/Capacitor-Native-667eea?style=flat-square)

## 🚀 Quick Start

**Web App:** Just open `index.html` in your browser!

**Mobile App:** See **[MOBILE-APP.md](MOBILE-APP.md)** for step-by-step instructions.

## 📱 Install on Your Phone

### Android (Chrome)
1. Open the app in Chrome browser
2. Tap the menu (3 dots) → "Add to Home screen" or "Install app"
3. The app will appear on your home screen like a native app!

### iOS (Safari)
1. Open the app in Safari browser
2. Tap the Share button (square with arrow)
3. Select "Add to Home Screen"
4. The app will appear on your home screen!

### Features When Installed
- ✅ Works offline (after first load)
- ✅ Full-screen experience (no browser UI)
- ✅ Fast loading
- ✅ Native app feel

## 🚀 How to Run Locally

### Method 1: Open Directly in Browser (Easiest)
1. Simply double-click `index.html` to open it in your default web browser
2. Or right-click `index.html` → "Open with" → Choose your browser (Chrome, Firefox, Edge, etc.)

### Method 2: Using VS Code Live Server Extension
1. Install "Live Server" extension in VS Code
2. Right-click on `index.html`
3. Select "Open with Live Server"

### Method 3: Using Python (if installed)
```bash
# Python 3
python -m http.server 8000

# Then open: http://localhost:8000
```

### Method 4: Using Node.js (if installed)
```bash
# Install http-server globally
npm install -g http-server

# Run server
http-server

# Then open: http://localhost:8080
```

## 🎯 Features

- 🎸 **Bass (4 strings)** - Standard 4-string bass tuning
- 🎸 **Bass (5 strings)** - 5-string bass with low B
- 🎸 **Guitar (6 strings)** - Standard guitar tuning
- 🎹 **Piano/Keyboard** - Interactive piano keyboard
- 🔺 **Triangle Pattern** - Visual triangle scale patterns
- 🎵 **Audio Playback** - Play scales and patterns
- 💡 **Beginner Mode** - Helpful tips and guidance
- 📱 **Mobile Optimized** - Touch-friendly interface
- 🔄 **Offline Support** - Works without internet
- ⚡ **PWA** - Install as native app

## 🎼 Supported Scales

- All 12 Major scales (C, C#, D, D#, E, F, F#, G, G#, A, A#, B)
- All 12 Minor scales (C, C#, D, D#, E, F, F#, G, G#, A, A#, B)

## 📱 Mobile App (Native)

Want to publish to App Store or Google Play? See **[MOBILE-APP.md](MOBILE-APP.md)** for complete instructions.

### Quick Setup:
```bash
npm install
npm run android  # For Android
npm run ios      # For iOS (Mac only)
```

## 📦 Deploy to GitHub Pages

1. Push your code to GitHub
2. Go to repository Settings → Pages
3. Select source branch (usually `main` or `master`)
4. Your app will be live at: `https://yourusername.github.io/repository-name/`

### Important for GitHub Pages
- Make sure `manifest.json` uses relative paths (already done)
- Service worker will work on GitHub Pages
- Update `service-worker.js` if your repo name is not root

## 🛠️ Development

### Project Structure
```
├── index.html          # Main HTML file
├── styles.css          # All styles
├── script.js           # Application logic
├── manifest.json       # PWA manifest
├── service-worker.js   # Offline support
├── icon-192.png        # App icon (192x192)
├── icon-512.png        # App icon (512x512)
└── README.md          # This file
```

### Creating App Icons

You need to create two icon files:
- `icon-192.png` (192x192 pixels)
- `icon-512.png` (512x512 pixels)

You can use any image editor or online tool to create these icons with a musical note or scale symbol.

## 📄 License

Free to use for personal and educational purposes.

## 🤝 Contributing

Feel free to fork, modify, and improve this app!

---

Enjoy practicing your scales! 🎵
