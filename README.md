# 🚀 SpaceX Launchpad Explorer

A beautifully designed React Native app built with **Expo** and **Expo Router**, allowing users to explore and navigate to SpaceX launchpads. The app displays launchpad details, shows your location on the map, and opens navigation directions in Google or Apple Maps.

---

## 🧱 Stack

- **Framework**: Expo SDK 53 + Expo Router
- **Language**: TypeScript
- **Navigation**: Expo Router(File Based Routing)
- **Maps**: `react-native-maps`
- **Permissions**: `expo-location`
- **State + Effects**: React Hooks, Custom Hooks

---

### ✅ Requirements

- Node.js 16+
- Expo CLI (`npm install -g expo-cli`)
- Android Studio or Xcode for simulators (optional)
- Google Map Api Key For Both Platforms(Android And IOS)

---

## 🔐 Environment Variables

This project uses environment variables to store sensitive data like API keys.

### 1. Add API KEYS in `.env` file in the root:

```
GOOGLE_MAPS_API_KEY = YOUR_API_KEY_HERE
GOOGLE_MAPS_API_KEY_IOS = YOUR_API_KEY_HERE
```

✅ **Note**: You’ve correctly setup the `.env` file .

---

## ⚙️ Getting Started

```bash
# Clone the repo
git clone https://github.com/Aarjav638/SpaceX.git
cd SpaceX

# Install dependencies
npm install

# Create Native Directories
npm run prebuild

# Run the app on android
npm run android
# Run the app on ios
npm run ios
#Run app through expo
npm run start

```

## 📍 Map Implementation

### Libraries Used

| Package                          | Purpose                                 |
| -------------------------------- | --------------------------------------- |
| `react-native-maps`              | Renders maps and markers                |
| `expo-location`                  | Requests location permission and access |
| `expo-linking`                   | Opens system settings or map apps       |
| `expo-linear-gradient`           | UI gradients                            |
| `expo-haptics`                   | Vibration feedback                      |
| `expo-router`                    | File-based routing                      |
| `react-native-safe-area-context` | Safe layout on all devices              |

### Features

- Renders a map centered on a launchpad.
- Shows a marker with the launchpad's location.
- Tracks and shows the user's current location.
- Opens Apple Maps (iOS) or Google Maps (Android) for driving directions.

---

## 🛡️ Permission Handling

### Flow For Details Screen

1. On screen focus, the app checks for location permission.
2. If not granted:
   - Prompts user via permission request modal.
   - After 2 failed attempts, directs user to system settings.

3. If granted:
   - Fetches current location.
   - Displays user marker on the map.
   - Show Navigation Button

### Custom Handling

- `usePersistedAttemptCount`: Tracks permission attempts to limit repeated prompts.
- `useLocationPermissionRefresh`: Listens to permission changes in the background.
- `useDebounce` : Debouncing the search query so minimum rerenders
- `useThemeConfig` : Listen For Theme Change
- `useThemeColor`: Returns the Color based on theme for Various Components
- Modal (`PermissionDenial`) and `ToastAndroid` give real-time feedback to users.

---

## 📸 Screenshots

> You can replace these with real screenshots from your app.

| Launchpad Map View            | Permission Modal                            | Directions                                  |
| ----------------------------- | ------------------------------------------- | ------------------------------------------- |
| ![Map](./screenshots/map.png) | ![Permission](./screenshots/permission.png) | ![Directions](./screenshots/directions.png) |

---

## 🧾 Scripts

| Script            | Description                      |
| ----------------- | -------------------------------- |
| `npm start`       | Starts the development server    |
| `npm run android` | Runs the app on Android emulator |
| `npm run ios`     | Runs the app on iOS simulator    |
| `npm run web`     | Runs the app on web browser      |
| `npm run lint`    | Fixes lint issues using ESLint   |

---

## 📁 Project Structure

```
spacex/
├── components/
│   ├── details/
│   ├── modals/
│   └── ui/
│   └── home/
├── hooks/
│   ├── useLocationPermissionRefresh.ts
│   └── usePermissionAttempt.ts
│   └── useTheme.ts
│   └── useDebounce.ts
│   └── useThemeColor.ts
├── lib/
│   └── utils.ts
│   └── index.ts
│   └── env.js
├── app/
│   └── Details/[details].tsx         <-- Map and details screen
│   └── _layout.tsx
│   └── index.tsx
│   └── +not-found.tsx
├── assets/
│   └── images/
│   └── fonts/
├── .env                    <-- API Key (not committed)
├── .gitignore
├── app.config.ts
├── .prettier.js
├── eslint.config.ts
├── metro.config.js
├── package.json
├── README.md
└── tsconfig.json
```

## 🛡️ License

This project is open-source.

---
