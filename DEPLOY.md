# 🚀 Deployment Guide

## Deploy to GitHub Pages

### Step 1: Create GitHub Repository
1. Go to GitHub and create a new repository
2. Name it something like `triangle-scale-visualizer` or `bass-scale-app`

### Step 2: Upload Files
```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: Triangle Scale Visualizer PWA"

# Add remote (replace with your repo URL)
git remote add origin https://github.com/yourusername/your-repo-name.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### Step 3: Enable GitHub Pages
1. Go to your repository on GitHub
2. Click **Settings** → **Pages**
3. Under "Source", select **main** branch
4. Click **Save**
5. Your app will be live at: `https://yourusername.github.io/repository-name/`

### Step 4: Create App Icons
1. Open `create-icons.html` in your browser
2. Click the download buttons to get `icon-192.png` and `icon-512.png`
3. Save them in the root directory of your project
4. Commit and push:
```bash
git add icon-*.png
git commit -m "Add app icons"
git push
```

## Testing PWA Installation

### On Android:
1. Open your GitHub Pages URL in Chrome
2. Tap menu (3 dots) → "Add to Home screen"
3. The app will install and work offline!

### On iOS:
1. Open your GitHub Pages URL in Safari
2. Tap Share button → "Add to Home Screen"
3. The app will appear on your home screen!

## Important Notes

- ✅ Service worker uses relative paths (works on GitHub Pages)
- ✅ All assets are cached for offline use
- ✅ App works in standalone mode (no browser UI)
- ✅ Mobile-optimized touch interface

## Troubleshooting

**Service Worker not registering?**
- Make sure you're accessing via HTTPS (GitHub Pages provides this)
- Check browser console for errors
- Clear browser cache and reload

**Icons not showing?**
- Make sure `icon-192.png` and `icon-512.png` are in the root directory
- Verify paths in `manifest.json` are correct

**App not installing?**
- Make sure you're using Chrome (Android) or Safari (iOS)
- Check that `manifest.json` is valid
- Verify service worker is registered (check DevTools → Application)
