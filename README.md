# Ohana Mobile

A React Native mobile application for household task management and family coordination.

## 🚀 Features

- **Authentication**: Secure login/register with JWT token management
- **Household Management**: Create and manage multiple households
- **Task Management**: Create, assign, and track tasks within households
- **Member Management**: Invite and manage household members
- **Real-time Updates**: Live task status updates
- **Cross-platform**: iOS, Android, and Web support

## 📱 Tech Stack

- **Framework**: React Native with Expo
- **Language**: TypeScript
- **State Management**: React Query + Context API
- **Navigation**: React Navigation
- **HTTP Client**: Axios
- **Forms**: Formik + Yup
- **Storage**: AsyncStorage
- **Authentication**: JWT with automatic refresh

## 🛠️ Development Setup

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Expo CLI (`npm install -g @expo/cli`)
- iOS Simulator (for iOS development)
- Android Studio (for Android development)

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd ohana-mobile
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the development server**

   ```bash
   npm start
   ```

4. **Run on specific platforms**

   ```bash
   # iOS
   npm run ios

   # Android
   npm run android

   # Web
   npm run web
   ```

## 🏗️ Project Structure

```
app/
├── common/                 # Shared components and utilities
│   ├── components/        # Reusable UI components
│   ├── config/           # App configuration
│   ├── context/          # Global state management
│   └── utils/            # Utility functions
├── features/             # Feature-based modules
│   ├── auth/            # Authentication feature
│   ├── households/      # Household management
│   ├── members/         # Member management
│   ├── navigation/      # App navigation
│   ├── profile/         # User profile
│   ├── sidebar/         # Sidebar navigation
│   ├── tasks/           # Task management
│   └── today/           # Today's tasks view
```

## 🧪 Testing

### Run Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Test Structure

- Unit tests for utilities and hooks
- Component tests for UI components
- Integration tests for features
- E2E tests for critical user flows

## 📦 Building for Production

### EAS Build (Recommended)

1. **Install EAS CLI**

   ```bash
   npm install -g @expo/eas-cli
   ```

2. **Login to Expo**

   ```bash
   eas login
   ```

3. **Configure EAS**

   ```bash
   eas build:configure
   ```

4. **Build for platforms**

   ```bash
   # Development build
   eas build --profile development --platform ios
   eas build --profile development --platform android

   # Preview build
   eas build --profile preview --platform all

   # Production build
   eas build --profile production --platform all
   ```

### Manual Build

```bash
# Prebuild native code
npm run prebuild

# Build for specific platforms
npm run build:android
npm run build:ios
npm run build:web
```

## 🚀 Deployment

### App Store Deployment

1. **Build production version**

   ```bash
   eas build --profile production --platform ios
   ```

2. **Submit to App Store**
   ```bash
   eas submit --profile production --platform ios
   ```

### Google Play Store Deployment

1. **Build production version**

   ```bash
   eas build --profile production --platform android
   ```

2. **Submit to Play Store**
   ```bash
   eas submit --profile production --platform android
   ```

## 🔧 Configuration

### Environment Variables

Create an `env.example` file and configure your environment variables:

```bash
# API Configuration
API_BASE_URL=http://10.0.2.2:4242
API_VERSION=v1

# Production API
PRODUCTION_API_BASE_URL=https://your-production-api.com

# App Configuration
APP_NAME=Ohana Mobile
APP_VERSION=1.0.0

# Feature Flags
ENABLE_ANALYTICS=false
ENABLE_CRASH_REPORTING=false
```

### API Configuration

Update the API endpoints in `app/common/config/environment.ts`:

```typescript
const configs: Record<Environment, EnvironmentConfig> = {
  development: {
    apiBaseUrl: 'http://10.0.2.2:4242',
    // ... other config
  },
  production: {
    apiBaseUrl: 'https://api.ohana.com',
    // ... other config
  },
};
```

## 📊 Monitoring & Analytics

### Error Tracking

- Integrated error boundary for React errors
- Comprehensive logging system
- Crash reporting (configurable)

### Performance Monitoring

- React Query for efficient data fetching
- Optimized re-renders with proper memoization
- Bundle size optimization

## 🔒 Security

- JWT token management with automatic refresh
- Secure token storage in AsyncStorage
- HTTPS enforcement in production
- Input validation with Yup schemas
- XSS protection through React Native

## 📈 Performance

### Optimization Strategies

- Lazy loading of components
- Image optimization
- Efficient state management
- Minimal re-renders
- Bundle splitting

### Performance Monitoring

- React Query DevTools (development)
- Performance profiling
- Memory leak detection

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Quality

- **Linting**: ESLint with TypeScript and React Native rules
- **Formatting**: Prettier for consistent code style
- **Type Checking**: TypeScript strict mode enabled
- **Testing**: Jest with React Native Testing Library

### Commit Guidelines

Follow conventional commits:

- `feat:` New features
- `fix:` Bug fixes
- `docs:` Documentation changes
- `style:` Code style changes
- `refactor:` Code refactoring
- `test:` Test changes
- `chore:` Build process changes

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:

- Create an issue in the repository
- Check the documentation
- Review the troubleshooting guide

## 🔄 Changelog

See [CHANGELOG.md](CHANGELOG.md) for a detailed history of changes.

---

Built with ❤️ using React Native and Expo
