# GitHub Actions Workflows

This directory contains GitHub Actions workflows for automated testing, building, and deployment of the Ohana Mobile app.

## Workflows

### 1. `test.yml` - Basic Testing

**Triggers:** Push to main, Pull requests to main
**Purpose:** Runs basic tests and linting

**Features:**

- Runs on Node.js 18.x and 20.x
- Installs dependencies with `npm ci`
- Runs linting with `npm run lint`
- Runs type checking with `npm run type-check`
- Runs tests with `npm test`
- Generates test coverage with `npm run test:coverage`
- Uploads coverage to Codecov

### 2. `ci.yml` - Comprehensive CI/CD Pipeline

**Triggers:** Push to main/develop, Pull requests to main/develop
**Purpose:** Full quality assurance and build verification

**Features:**

- **Quality Job:**
  - Security audit with `npm audit`
  - Linting with auto-fix check
  - Type checking
  - Prettier formatting check
- **Testing Job:**
  - Matrix testing on Node.js 18.x and 20.x
  - Test coverage generation
  - Codecov integration
- **Build Job (main branch only):**
  - Expo configuration verification
  - Web bundle size check
  - Build artifact upload

### 3. `eas-build.yml` - EAS Build & Deploy

**Triggers:** Push to main, Pull requests to main
**Purpose:** Automated mobile app builds using Expo Application Services

**Features:**

- **Pull Requests:**
  - Android APK (preview profile)
  - iOS Simulator build (preview profile)
- **Main Branch:**
  - Android App Bundle (production profile)
  - iOS Archive (production profile)

## Required Secrets

### For EAS Builds:

- `EXPO_TOKEN`: Your Expo access token for EAS builds

### For Codecov (Optional):

- `CODECOV_TOKEN`: Your Codecov token for coverage reporting

## Setup Instructions

1. **Enable GitHub Actions:**
   - Go to your repository Settings → Actions → General
   - Enable "Allow all actions and reusable workflows"

2. **Add Required Secrets:**
   - Go to Settings → Secrets and variables → Actions
   - Add `EXPO_TOKEN` with your Expo access token

3. **Configure EAS (for mobile builds):**

   ```bash
   npm install -g @expo/cli
   expo login
   expo build:configure
   ```

4. **Optional: Setup Codecov:**
   - Connect your repository to Codecov
   - Add `CODECOV_TOKEN` secret if needed

## Workflow Selection

- **For simple projects:** Use `test.yml` only
- **For production apps:** Use `ci.yml` for quality checks
- **For mobile apps:** Use `eas-build.yml` for automated builds
- **For full CI/CD:** Use all three workflows

## Customization

### Environment Variables

You can customize the workflows by adding environment variables:

```yaml
env:
  NODE_VERSION: '20.x'
  TEST_TIMEOUT: '10000'
```

### Matrix Strategies

Modify the Node.js versions in the matrix:

```yaml
strategy:
  matrix:
    node-version: [16.x, 18.x, 20.x]
```

### Conditional Execution

Add conditions to run jobs only in specific cases:

```yaml
if: github.event_name == 'push' && github.ref == 'refs/heads/main'
```

## Troubleshooting

### Common Issues:

1. **Tests failing in CI but passing locally:**
   - Check Node.js version compatibility
   - Verify all dependencies are in `package.json`
   - Ensure environment variables are properly set

2. **EAS builds failing:**
   - Verify `EXPO_TOKEN` is valid
   - Check `eas.json` configuration
   - Ensure all required Expo plugins are installed

3. **Coverage upload failing:**
   - Verify Codecov integration
   - Check if `lcov.info` file is generated
   - Ensure coverage thresholds are met

### Debug Workflows:

- Check the Actions tab in your GitHub repository
- Review workflow logs for specific error messages
- Use `act` for local workflow testing (optional)
