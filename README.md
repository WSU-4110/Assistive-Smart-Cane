# Smart Cane Dashboard

React Native mobile app for controlling and monitoring the Assistive Smart Cane device.

## Features

### 📱 Dashboard Interface
- **Connection Management** - Bluetooth pairing and status monitoring
- **LED Control** - Toggle cane LED lights on/off  
- **Alert Settings** - Adjust vibration intensity and buzzer volume with interactive sliders
- **Device Status** - Monitor battery level, signal strength, and temperature
- **Emergency Button** - Hold-to-call emergency contacts with countdown

### 🎨 Design
- Clean card-based UI with shadows and rounded corners
- Light theme with blue/purple accent colors
- Interactive sliders with live percentage updates
- Status indicators with progress bars and signal strength meters

## Technical Stack
- **React Native** with TypeScript
- **Expo** for development and deployment
- **@expo/vector-icons** for iconography
- **@react-native-community/slider** for interactive controls

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm start

# Run on iOS
npm run ios

# Run on Android  
npm run android
```

## Project Structure
```
├── App.tsx                    # Main app entry
├── components/               # UI components
│   ├── ConnectionCard.tsx   # Bluetooth connection
│   ├── LedLightCard.tsx     # LED control
│   ├── AlertSettingsCard.tsx # Settings sliders
│   ├── CaneStatusCard.tsx   # Device status
│   └── EmergencyButton.tsx  # Emergency contact
├── screens/
│   └── DashboardScreen.tsx  # Main screen layout
└── constants/
    └── colors.ts           # Color theme
```
