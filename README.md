# Smart Cane Dashboard

React Native mobile app for controlling and monitoring the Assistive Smart Cane device. This repository also includes the cane’s firmware and supporting documentation.

## Features

### Dashboard Interface
- **Connection Management** – Bluetooth pairing and status monitoring  
- **LED Control** – Toggle cane LED lights on/off  
- **Alert Settings** – Adjust vibration intensity and buzzer volume with interactive sliders  
- **Device Status** – Monitor battery level, signal strength, and temperature  
- **Emergency Button** – Hold-to-call emergency contacts with countdown  

### Design
- Clean card-based UI with shadows and rounded corners  
- Light theme with blue/purple accent colors  
- Interactive sliders with live percentage updates  
- Status indicators with progress bars and signal strength meters  

## Technical Stack
- **React Native** with TypeScript  
- **Expo** for development and deployment  
- **@expo/vector-icons** for iconography  
- **@react-native-community/slider** for interactive controls  
- **Jest** with ts-jest for unit testing  

---

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

## Testing

This project uses Jest for unit testing.

### Setup
```bash
# Testing dependencies are already installed
# Jest configuration is in jest.config.js
```

### Running Tests
```bash
# Run all tests
npm test

# Run tests with coverage report
npm run test:coverage

# Run tests in watch mode (auto-rerun on changes)
npm run test:watch
```

### Test Structure
Tests are located in `__tests__` folders next to the code they test:
```
app/services/
├── DeviceStatusManager.ts
└── __tests__/
    └── DeviceStatusManager.test.ts
```

## Project Structure
```
Assistive-Smart-Cane/
│
├── app/                         # React Native mobile app
│   ├── App.tsx                  # Main app entry
│   ├── components/              # UI components
│   ├── screens/                 # Screens and layouts
│   ├── constants/               # Theme and config files
│   ├── hooks/                   # Custom React hooks
│   ├── services/                # Business logic & Bluetooth management
│   │   └── __tests__/           # Unit tests
│   └── assets/                  # Images and icons
├── firmware/                    # Arduino firmware for the cane
├── docs/                        # Documentation
├── tests/                       # System tests
├── .gitignore
├── app.json
├── jest.config.js
├── package.json
├── package-lock.json
├── tsconfig.json
└── README.md
```
