// Capacitor Native Features
// This file handles native app features when running in Capacitor

(async function() {
    // Check if running in native app
    const isNative = window.Capacitor && window.Capacitor.isNativePlatform();

    if (isNative) {
        console.log('Running in native app mode');
        
        try {
            // Dynamically import Capacitor plugins
            const { App } = await import('@capacitor/app');
            const { Haptics, ImpactStyle } = await import('@capacitor/haptics');
            const { Keyboard } = await import('@capacitor/keyboard');
            const { StatusBar, Style } = await import('@capacitor/status-bar');
            const { SplashScreen } = await import('@capacitor/splash-screen');

            // Set status bar style
            await StatusBar.setStyle({ style: Style.Dark });
            await StatusBar.setBackgroundColor({ color: '#667eea' });

            // Hide splash screen after app is ready
            await SplashScreen.hide();

            // Handle keyboard
            await Keyboard.setAccessoryBarVisible({ isVisible: false });

            // Handle app state changes
            App.addListener('appStateChange', ({ isActive }) => {
                console.log('App state changed. Is active?', isActive);
            });

            // Handle back button (Android)
            App.addListener('backButton', ({ canGoBack }) => {
                if (!canGoBack) {
                    App.exitApp();
                } else {
                    window.history.back();
                }
            });

            // Haptic feedback function
            window.triggerHaptic = async function(style = 'light') {
                try {
                    const impactStyle = style === 'medium' ? ImpactStyle.Medium : 
                                     style === 'heavy' ? ImpactStyle.Heavy : ImpactStyle.Light;
                    await Haptics.impact({ style: impactStyle });
                } catch (err) {
                    console.log('Haptic feedback not available:', err);
                }
            };

            console.log('Capacitor plugins initialized successfully');
        } catch (error) {
            console.error('Error initializing Capacitor plugins:', error);
            // Fallback if plugins fail to load
            window.triggerHaptic = function(style) {
                console.log('Haptic feedback not available');
            };
        }
    } else {
        console.log('Running in web browser mode');
        // Fallback for web - haptic function does nothing
        window.triggerHaptic = function(style) {
            // No-op for web
        };
    }
})();
