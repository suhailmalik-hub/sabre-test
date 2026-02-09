# Toast Library

A centralized toast notification system for displaying messages throughout the application.

## 📁 Directory Structure

```
src/code/lib/toast/
├── index.ts                    # Main export file (use this for imports)
├── ToastService.ts             # Core toast service (singleton)
├── useToast.ts                 # React hook for components
└── GlobalToastContainer.tsx    # Global toast UI component
```

## 🚀 Quick Start

### 1. Import from the library

```typescript
// ✅ Recommended: Import from index
import { ToastService, GlobalToastContainer, useToast } from '../lib/toast';

// ✅ Also works: Direct imports
import { ToastService } from '../lib/toast/ToastService';
import { GlobalToastContainer } from '../lib/toast/GlobalToastContainer';
```

### 2. Add GlobalToastContainer to your app (once)

```tsx
import { GlobalToastContainer } from '../lib/toast';

export const YourRootComponent = () => {
  return (
    <div>
      <GlobalToastContainer />
      {/* Rest of your app */}
    </div>
  );
};
```

### 3. Use ToastService anywhere

```typescript
import { ToastService } from '../lib/toast';

// Success, warning, or error toasts
ToastService.showSuccess('Operation completed!');
ToastService.showWarning('Please review data');
ToastService.showError('Something went wrong');
```

## 📖 API Reference

### ToastService

**Methods:**

- `showSuccess(message: string, duration?: number): void`
- `showWarning(message: string, duration?: number): void`
- `showError(message: string, duration?: number): void`
- `hide(): void`

**Default duration:** 5000ms (5 seconds)

### useToast Hook

```typescript
const { currentToast, hideToast } = useToast();
```

**Returns:**

- `currentToast`: Current toast object or null
- `hideToast`: Function to manually hide the toast

### GlobalToastContainer Component

```tsx
<GlobalToastContainer />
```

Place once at the root of your app. Automatically subscribes to ToastService events.

## 💡 Usage Examples

### In API/REST Files

```typescript
// src/code/api/rest/someApi.ts
import { ToastService } from '../../lib/toast';

export const fetchData = async () => {
  try {
    const response = await api.getData();
    ToastService.showSuccess('Data loaded successfully!');
    return response.data;
  } catch (error) {
    ToastService.showError('Failed to load data');
    throw error;
  }
};
```

### In React Components

```tsx
import { ToastService } from '../lib/toast';

export const MyComponent = () => {
  const handleSubmit = async () => {
    try {
      await saveData();
      ToastService.showSuccess('Saved!');
    } catch (error) {
      ToastService.showError('Failed to save');
    }
  };

  return <button onClick={handleSubmit}>Submit</button>;
};
```

### With Custom Duration

```typescript
// Short notification (2 seconds)
ToastService.showSuccess('Copied!', 2000);

// Standard (5 seconds - default)
ToastService.showSuccess('Item saved');

// Long notification (10 seconds)
ToastService.showError('Critical error', 10000);

// No auto-hide (manual close only)
ToastService.showWarning('Review required', 0);
```

## 🎨 Toast Types

| Type      | Usage                                | Color  |
| --------- | ------------------------------------ | ------ |
| `success` | Completed operations, confirmations  | Green  |
| `warning` | Important info, requires attention   | Orange |
| `error`   | Failed operations, validation errors | Red    |
