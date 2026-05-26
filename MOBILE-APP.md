# 📱 Mobile App Setup Guide

This guide will help you build native Android and iOS apps from this web app using Capacitor.

## Prerequisites

### For Android:
- ✅ Node.js (v14 or higher)
- ✅ Java JDK 11 or higher
- ✅ Android Studio (latest version)
- ✅ Android SDK (API level 33+)

### For iOS (Mac only):
- ✅ Node.js (v14 or higher)
- ✅ Xcode 14+ (from Mac App Store)
- ✅ CocoaPods: `sudo gem install cocoapods`

## Step 1: Install Dependencies

```bash
npm install
```

This will install:
- Capacitor CLI
- Capacitor Core
- Capacitor Plugins (App, Haptics, Keyboard, StatusBar, SplashScreen)

## Step 2: Initialize Capacitor

```bash
# Add Android platform
npm run cap:add android

# Add iOS platform (Mac only)
npm run cap:add ios
```

## Step 3: Sync Web Assets

After making changes to your web files, sync them to native projects:

```bash
npm run cap:sync
```

This copies your web files to the native projects.

## Step 4: Build and Run

### Android

**Option A: Using Android Studio (Recommended)**
```bash
npm run android
```
This will:
1. Sync your web files
2. Open Android Studio
3. You can then run the app on an emulator or connected device

**Option B: Command Line Build**
```bash
npm run build:android
```
This creates an APK file in `android/app/build/outputs/apk/debug/`

**To install on device:**
1. Enable "Developer Options" on your Android phone
2. Enable "USB Debugging"
3. Connect phone via USB
4. In Android Studio, click "Run" → Select your device

### iOS (Mac only)

```bash
npm run ios
```

This will:
1. Sync your web files
2. Open Xcode
3. Select a simulator or connected device
4. Click the Play button to build and run

**To install on iPhone:**
1. Connect iPhone via USB
2. In Xcode, select your device
3. You may need to sign the app with your Apple ID (free)
4. Click Play to install

## Step 5: Configure App

### App ID
Edit `capacitor.config.json` to change the app ID:
```json
{
  "appId": "com.yourname.trianglescale"
}
```

### App Name
Change the app name in `capacitor.config.json`:
```json
{
  "appName": "Your App Name"
}
```

### Icons and Splash Screen

**Android:**
- Icons: `android/app/src/main/res/mipmap-*/ic_launcher.png`
- Splash: Edit `android/app/src/main/res/values/styles.xml`

**iOS:**
- Icons: `ios/App/App/Assets.xcassets/AppIcon.appiconset/`
- Splash: `ios/App/App/Assets.xcassets/Splash.imageset/`

You can use online tools like:
- https://www.appicon.co/
- https://icon.kitchen/

## Step 6: Build for Release

### Android (APK)
```bash
cd android
./gradlew assembleRelease
```
APK will be in: `android/app/build/outputs/apk/release/app-release.apk`

### Android (AAB for Play Store)
```bash
cd android
./gradlew bundleRelease
```
AAB will be in: `android/app/build/outputs/bundle/release/app-release.aab`

### iOS (for App Store)
1. Open Xcode
2. Product → Archive
3. Distribute App → App Store Connect

## Troubleshooting

### "Command not found: cap"
```bash
npx cap sync
```

### Android build fails
- Make sure Android SDK is installed
- Check that JAVA_HOME is set correctly
- Try: `cd android && ./gradlew clean`

### iOS build fails
- Run: `cd ios && pod install`
- Make sure Xcode Command Line Tools are installed: `xcode-select --install`

### App doesn't update
- Run `npm run cap:sync` after web changes
- Rebuild the app in Android Studio/Xcode

## Features Enabled

✅ **Haptic Feedback** - Vibrations on button presses (native only)
✅ **Status Bar** - Custom status bar styling
✅ **Splash Screen** - Custom splash screen
✅ **Keyboard** - Better keyboard handling
✅ **Back Button** - Android back button support
✅ **App State** - Handles app going to background

## Publishing

### Google Play Store
1. Create a developer account ($25 one-time fee)
2. Build release AAB: `cd android && ./gradlew bundleRelease`
3. Upload to Play Console
4. Fill in store listing, screenshots, etc.

### Apple App Store
1. Create Apple Developer account ($99/year)
2. Archive app in Xcode
3. Upload via App Store Connect
4. Submit for review

## Development Workflow

1. **Make web changes** → Edit HTML/CSS/JS files
2. **Sync to native** → `npm run cap:sync`
3. **Test in native** → `npm run android` or `npm run ios`
4. **Repeat** → Make changes and sync again

## Need Help?

- Capacitor Docs: https://capacitorjs.com/docs
- Android Docs: https://developer.android.com/
- iOS Docs: https://developer.apple.com/documentation/

---

Happy coding! 🎸📱
