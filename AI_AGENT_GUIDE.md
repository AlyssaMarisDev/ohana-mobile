# AI Agent Guide for Ohana Mobile

## 🎯 Project Overview

**Ohana Mobile** is a React Native/Expo application for household task management and family coordination. It's built with TypeScript, uses React Query for state management, and follows a feature-based architecture.

### Key Technologies

- **Framework**: React Native with Expo SDK 53
- **Language**: TypeScript (strict mode enabled)
- **State Management**: React Query (TanStack Query) + Context API
- **Navigation**: React Navigation v7
- **HTTP Client**: Axios with authentication interceptors
- **Forms**: Formik + Yup validation
- **Storage**: AsyncStorage for token persistence
- **Testing**: Jest with React Native Testing Library

## 🏗️ Project Structure

```
app/
├── common/                 # Shared components and utilities
│   ├── components/        # Reusable UI components (Button, Text, etc.)
│   ├── config/           # App configuration (colors, text, environment)
│   ├── context/          # Global state management (GlobalStateContext)
│   └── utils/            # Utility functions (BaseService, logger, etc.)
├── features/             # Feature-based modules
│   ├── auth/            # Authentication (login, register, token management)
│   ├── households/      # Household management
│   ├── members/         # Member management
│   ├── navigation/      # App navigation setup
│   ├── profile/         # User profile management
│   ├── sidebar/         # Sidebar navigation
│   ├── tags/            # Tag management system
│   ├── tasks/           # Task management (CRUD operations)
│   └── today/           # Today's tasks view
```

### Feature Module Structure

Each feature follows this pattern:

```
feature/
├── components/          # Feature-specific UI components
├── hooks/              # Custom React hooks
├── screens/            # Screen components
├── services/           # API service classes
└── utils/              # Feature-specific utilities
```

## ✅ Best Practices

### 1. **Code Organization**

- **DO**: Place test files co-located with source code (same directory)
- **DO**: Use feature-based architecture - group related functionality together
- **DO**: Keep components small and focused on single responsibility
- **DO**: Use TypeScript interfaces for all data structures
- **DO**: Export components from feature index files for clean imports

### 2. **State Management**

- **DO**: Use React Query for server state (API calls, caching)
- **DO**: Use Context API for global UI state (user preferences, theme)
- **DO**: Use local state for component-specific state
- **DO**: Implement proper error handling and loading states
- **DO**: Use optimistic updates for better UX

### 3. **API Integration**

- **DO**: Extend BaseService for all API calls
- **DO**: Use authenticatedAxios for authenticated requests
- **DO**: Implement proper error handling with try/catch
- **DO**: Use React Query for caching and background updates
- **DO**: Handle token refresh automatically

### 4. **Component Design**

- **DO**: Use functional components with hooks
- **DO**: Implement proper prop interfaces
- **DO**: Use configs.colors for consistent theming
- **DO**: Make components reusable and configurable
- **DO**: Use proper TypeScript types for all props

### 5. **Testing**

- **DO**: Write tests for utilities and hooks
- **DO**: Test component behavior, not implementation
- **DO**: Use meaningful test descriptions
- **DO**: Mock external dependencies
- **DO**: Test error states and edge cases

## ❌ Don'ts

### 1. **Code Quality**

- **DON'T**: Use `any` types - always define proper interfaces
- **DON'T**: Use console.log in production code - use the logger utility
- **DON'T**: Create deeply nested component hierarchies
- **DON'T**: Mix business logic with UI components
- **DON'T**: Hardcode API URLs or configuration values

### 2. **State Management**

- **DON'T**: Use global state for component-specific data
- **DON'T**: Mutate state directly - always use proper state setters
- **DON'T**: Forget to handle loading and error states
- **DON'T**: Cache sensitive data in React Query

### 3. **Performance**

- **DON'T**: Create unnecessary re-renders
- **DON'T**: Forget to memoize expensive computations
- **DON'T**: Load large datasets without pagination
- **DON'T**: Use inline styles for repeated styles

### 4. **Security**

- **DON'T**: Store sensitive data in AsyncStorage without encryption
- **DON'T**: Expose API keys in client-side code
- **DON'T**: Trust user input without validation
- **DON'T**: Log sensitive information

## 🔧 Development Workflow

### 1. **Before Making Changes**

- **ALWAYS**: Scan build.gradle.kts files if working with native code
- **ALWAYS**: Read relevant files in the project before giving answers
- **ALWAYS**: Check existing patterns in similar components
- **ALWAYS**: Review the feature's existing structure

### 2. **When Creating New Features**

1. Create the feature directory structure
2. Define TypeScript interfaces for data models
3. Create the service class extending BaseService
4. Implement React Query hooks
5. Create UI components
6. Add screens and navigation
7. Write tests for critical functionality

### 3. **When Modifying Existing Features**

1. Understand the current implementation
2. Check for existing tests
3. Maintain backward compatibility when possible
4. Update related components and tests
5. Follow existing naming conventions

### 4. **Code Review Checklist**

- [ ] TypeScript types are properly defined
- [ ] No console.log statements (use logger utility)
- [ ] Error handling is implemented
- [ ] Loading states are handled
- [ ] Tests are written for new functionality
- [ ] Code follows existing patterns
- [ ] No linting errors

## 🎨 UI/UX Guidelines

### 1. **Design System**

- **Colors**: Use `configs.colors` for consistent theming
- **Typography**: Use the Text component with proper sizing
- **Spacing**: Use consistent padding/margin values
- **Icons**: Use MaterialCommunityIcons from @expo/vector-icons

### 2. **Component Patterns**

- **Screens**: Use the Screen component as wrapper
- **Forms**: Use Formik + Yup for validation
- **Buttons**: Use the Button component with proper variants
- **Inputs**: Use TextInput component with icons
- **Modals**: Use proper modal patterns with keyboard handling

### 3. **Responsive Design**

- Use flexbox for layouts
- Handle different screen sizes
- Consider safe areas for notches
- Test on both iOS and Android

## 🧪 Testing Guidelines

### 1. **Test Structure**

```typescript
// Component test example
describe('ComponentName', () => {
  it('should render correctly', () => {
    // Test implementation
  });

  it('should handle user interactions', () => {
    // Test user actions
  });

  it('should handle error states', () => {
    // Test error scenarios
  });
});
```

### 2. **Testing Best Practices**

- Test component behavior, not implementation details
- Mock external dependencies (API calls, navigation)
- Test both success and error paths
- Use meaningful test descriptions
- Keep tests focused and isolated

### 3. **Test Coverage Requirements**

- 70% minimum coverage for branches, functions, lines, and statements
- Test critical user flows
- Test error handling scenarios
- Test edge cases and boundary conditions

## 🔍 Common Patterns

### 1. **Service Class Pattern**

```typescript
export class FeatureService extends BaseService {
  constructor() {
    super(authenticatedAxios);
  }

  async getData(): Promise<DataType[]> {
    const response = await this.get<ApiResponse>('/endpoint');
    return response.data.items;
  }
}
```

### 2. **React Query Hook Pattern**

```typescript
export const useFeatureData = () => {
  return useQuery<DataType[], Error>({
    queryKey: ['feature-data'],
    queryFn: () => featureService.getData(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};
```

### 3. **Component Pattern**

```typescript
interface ComponentProps {
  data: DataType[];
  onAction: (id: string) => void;
  isLoading?: boolean;
}

export const Component: React.FC<ComponentProps> = ({
  data,
  onAction,
  isLoading = false,
}) => {
  // Component implementation
};
```

## 🚨 Error Handling

### 1. **API Errors**

- Use try/catch blocks in service methods
- Implement proper error boundaries
- Show user-friendly error messages
- Log errors for debugging

### 2. **Validation Errors**

- Use Yup schemas for form validation
- Show validation errors inline
- Prevent form submission with invalid data

### 3. **Network Errors**

- Handle offline scenarios
- Implement retry mechanisms
- Show appropriate error messages

## 📱 Platform Considerations

### 1. **iOS vs Android**

- Test on both platforms
- Handle platform-specific differences
- Use platform-specific APIs when needed
- Consider different navigation patterns

### 2. **Performance**

- Optimize bundle size
- Use lazy loading for large components
- Implement proper memoization
- Monitor memory usage

## 🔄 Version Control

### 1. **Commit Messages**

Follow conventional commits:

- `feat:` New features
- `fix:` Bug fixes
- `docs:` Documentation changes
- `style:` Code style changes
- `refactor:` Code refactoring
- `test:` Test changes
- `chore:` Build process changes

### 2. **Branch Strategy**

- Use feature branches for new development
- Keep branches focused and small
- Update documentation with changes
- Include tests with new features

## 🆘 Troubleshooting

### 1. **Common Issues**

- **Metro bundler issues**: Clear cache with `npm start -- --clear`
- **TypeScript errors**: Check for missing types or incorrect imports
- **Navigation issues**: Verify navigation setup and screen registration
- **API issues**: Check authentication and endpoint configuration

### 2. **Debugging**

- Use React Native Debugger
- Check React Query DevTools
- Monitor network requests
- Review error logs

## 📚 Additional Resources

- [React Native Documentation](https://reactnative.dev/)
- [Expo Documentation](https://docs.expo.dev/)
- [React Query Documentation](https://tanstack.com/query)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

---

**Remember**: Always prioritize code quality, user experience, and maintainability. When in doubt, follow existing patterns in the codebase and maintain consistency with the established conventions.
