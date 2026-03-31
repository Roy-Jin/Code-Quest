# PWA Update Feature Documentation

## Overview

The PWA (Progressive Web App) update feature provides a seamless way to notify users when a new version of the application is available and allows them to update with a single click.

## Components

### 1. PwaReloadPrompt Component

Located at: `src/components/PwaReloadPrompt.tsx`

This component displays a beautiful modal dialog when a new version is detected:

- **Features:**
  - Animated modal with backdrop blur
  - Rotating refresh icon
  - Feature highlights
  - Two action buttons: "Refresh Now" and "Later"
  - Fully internationalized (English & Chinese)
  - Smooth animations using Framer Motion

### 2. usePwaUpdate Hook

Located at: `src/hooks/usePwaUpdate.ts`

This custom hook manages the PWA update logic:

- **Features:**
  - Automatic service worker registration
  - Periodic update checks (every 60 seconds)
  - State management for update prompt visibility
  - Update and dismiss handlers

### 3. Integration in App.tsx

The `PwaReloadPrompt` component is integrated at the root level of the application, ensuring it appears on top of all other content when an update is available.

## How It Works

1. **Service Worker Registration**: When the app loads, the service worker is registered automatically
2. **Update Detection**: The app checks for updates every 60 seconds
3. **User Notification**: When an update is detected, the `PwaReloadPrompt` modal appears
4. **User Action**: 
   - Click "Refresh Now" → App reloads with the new version
   - Click "Later" or backdrop → Modal closes, user can continue using current version

## Internationalization

The update prompt supports both English and Chinese:

### English
- Title: "New Version Available"
- Description: "We've found a new version. Refresh the page to get the latest features."
- Button: "Refresh Now" / "Later"

### Chinese
- Title: "新版本可用"
- Description: "我们发现了新版本，刷新页面以获取最新功能"
- Button: "立即刷新" / "稍后"

## Configuration

### Vite PWA Plugin Settings

Located in: `vite.config.ts`

```typescript
VitePWA({
  registerType: "prompt",  // Shows prompt instead of auto-updating
  injectRegister: "auto",  // Automatically injects registration code
  workbox: {
    globPatterns: ["**/*.{js,css,html,ico,png,svg,mp3}"],
    maximumFileSizeToCacheInBytes: 5 * 1024 * 1024, // 5 MB
  },
  // ... manifest configuration
})
```

## Testing

### Development Mode

1. Run the dev server: `npm run dev`
2. The PWA features are enabled in development mode
3. Open DevTools → Application → Service Workers
4. You can manually trigger updates or unregister/register the service worker

### Production Mode

1. Build the app: `npm run build`
2. Serve the built files: `npm run preview` or use a static server
3. Make changes and rebuild
4. The update prompt should appear automatically

## Best Practices

1. **Update Frequency**: The current check interval is 60 seconds. Adjust in `usePwaUpdate.ts` if needed
2. **User Experience**: The "Later" option allows users to continue working without interruption
3. **Data Safety**: The update process preserves all user data (localStorage, IndexedDB)
4. **Visual Feedback**: Clear animations and icons help users understand what's happening

## Customization

### Styling

The component uses Tailwind CSS classes. Key styling elements:
- Gradient backgrounds: `from-amber-600 to-orange-600`
- Border radius: `rounded-2xl`
- Shadows: `shadow-2xl shadow-amber-500/20`

### Animation

Animations are powered by Framer Motion:
- Modal entrance: Scale and fade
- Icon rotation: Continuous 360° rotation
- Button interactions: Scale on hover/tap

### Update Check Interval

To change the update check frequency, modify the interval in `usePwaUpdate.ts`:

```typescript
setInterval(() => {
  registration.update()
}, 60_000) // Change this value (in milliseconds)
```

## Troubleshooting

### Update Not Detected

1. Clear browser cache and service workers
2. Check if service worker is registered in DevTools
3. Verify the build version has actually changed

### Modal Not Appearing

1. Check console for errors
2. Verify `PwaReloadPrompt` is rendered in `App.tsx`
3. Ensure `usePwaUpdate` hook is working correctly

### Update Fails

1. Check network connection
2. Verify service worker is active
3. Try hard refresh (Ctrl+Shift+R or Cmd+Shift+R)

## Future Enhancements

Possible improvements:
- Add version number display
- Show changelog in the modal
- Add "Don't show again" option
- Implement update scheduling
- Add progress indicator during update
