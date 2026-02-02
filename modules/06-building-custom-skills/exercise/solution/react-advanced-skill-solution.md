---
name: react-advanced-patterns
description: Comprehensive React knowledge including patterns, performance, and best practices
context: fork
model: sonnet
disable-model-invocation: false
environment:
  NODE_ENV: development
  REACT_VERSION: "18.x"
input_schema:
  type: object
  properties:
    topic:
      type: string
      enum: [performance, architecture, testing, security, migration]
      description: Specific React topic for guidance
    experience_level:
      type: string
      enum: [beginner, intermediate, advanced]
      default: intermediate
monitoring:
  max_execution_time: 60s
  memory_limit: 512MB
  log_level: info
---

# React Advanced Knowledge Base

## Core Principles & Philosophy

React is fundamentally about **declarative UI composition** and **unidirectional data flow**. Master these principles and everything else builds on them.

### Key Mental Models
- **Components as Functions**: Inputs (props) → Outputs (UI)
- **State as Memory**: What changes over time in your component
- **Effects as Side Effects**: How components interact with the outside world
- **Props as Configuration**: Immutable data passed from parent to child

### The React Way
```jsx
// Declarative: What you want, not how to get there
<UserList users={users} loading={loading} />

// Not Imperative: Step-by-step DOM manipulation
```

## Essential Patterns

### 1. Compound Components
Create flexible component APIs through composition:
```jsx
const Menu = ({ children }) => <div className="menu">{children}</div>;
const MenuItem = ({ children, onClick }) => (
  <button className="menu-item" onClick={onClick}>{children}</button>
);

// Usage
<Menu>
  <MenuItem onClick={handleSave}>Save</MenuItem>
  <MenuItem onClick={handleCancel}>Cancel</MenuItem>
</Menu>
```

### 2. Custom Hooks for Logic Reuse
Extract component logic into reusable hooks:
```jsx
const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(key));
    } catch {
      return initialValue;
    }
  });

  const setValue = (value) => {
    setStoredValue(value);
    localStorage.setItem(key, JSON.stringify(value));
  };

  return [storedValue, setValue];
};

// Usage
const [name, setName] = useLocalStorage('name', 'Guest');
```

### 3. Render Props Pattern
Share rendering logic between components:
```jsx
const DataSource = ({ getData, render }) => {
  const [data, setData] = useState(null);
  
  useEffect(() => {
    getData().then(setData);
  }, [getData]);

  return render(data);
};

// Usage
<DataSource
  getData={() => api.fetchUser()}
  render={(user) => user ? <UserProfile user={user} /> : <Loading />}
/>
```

### 4. Higher-Order Components
Wrap components with additional behavior:
```jsx
const withAuth = (Component) => {
  return (props) => {
    const { user } = useAuth();
    
    if (!user) {
      return <LoginRequired />;
    }
    
    return <Component {...props} user={user} />;
  };
};

// Usage
const ProtectedProfile = withAuth(UserProfile);
```

## Common Anti-Patterns

### ❌ Direct Mutation
```jsx
// ANTI-PATTERN: Direct state mutation
const updateProfile = (user) => {
  user.name = 'New Name'; // Mutates directly
  setUser(user);
};

// ✅ CORRECT: Immutable update
const updateProfile = (user) => {
  setUser({ ...user, name: 'New Name' });
};
```

### ❌ useEffect Dependencies Missing
```jsx
// ANTI-PATTERN: Missing dependencies cause bugs
useEffect(() => {
  fetchUser(userId);
}, []); // Missing userId dependency!

// ✅ CORRECT: Include all dependencies
useEffect(() => {
  fetchUser(userId);
}, [userId, fetchUser]); // Include fetchUser if it's from props
```

### ❌ Inline Functions in Render
```jsx
// ANTI-PATTERN: Creates new functions each render
<Button onClick={() => setCount(count + 1)}>Click</Button>

// ✅ CORRECT: Memoize or extract
const increment = useCallback(() => setCount(c => c + 1), []);
<Button onClick={increment}>Click</Button>
```

### ❌ Prop Drilling
```jsx
// ANTI-PATTERN: Passing props through many levels
<App>
  <Header user={user} />
  <Main>
    <Sidebar user={user} />
    <Content user={user} />
  </Main>
</App>

// ✅ CORRECT: Use Context
const UserContext = createContext();
const UserProvider = ({ children, user }) => (
  <UserContext.Provider value={user}>{children}</UserContext.Provider>
);
```

## Implementation Examples

### Performance-Optimized List
```jsx
import { memo, useMemo, useCallback } from 'react';

const ListItem = memo(({ item, onSelect, onDelete }) => {
  // Memoize event handlers to prevent unnecessary re-renders
  const handleSelect = useCallback(() => onSelect(item.id), [item.id, onSelect]);
  const handleDelete = useCallback(() => onDelete(item.id), [item.id, onDelete]);
  
  return (
    <div>
      <h3>{item.name}</h3>
      <button onClick={handleSelect}>Select</button>
      <button onClick={handleDelete}>Delete</button>
    </div>
  );
});

const List = ({ items, onSelect, onDelete }) => {
  // Memoize filtered/sorted items
  const sortedItems = useMemo(
    () => items.sort((a, b) => a.name.localeCompare(b.name)),
    [items]
  );

  return (
    <div>
      {sortedItems.map(item => (
        <ListItem
          key={item.id}
          item={item}
          onSelect={onSelect}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};
```

### Error Boundary Implementation
```jsx
class ErrorBoundary extends Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    // Send to error reporting service
    reportError(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <h2>Something went wrong</h2>
          <details>
            {this.state.error?.message}
          </details>
          <button onClick={() => this.setState({ hasError: false })}>
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// Usage
<ErrorBoundary>
  <App />
</ErrorBoundary>
```

## Performance Optimization

### 1. Code Splitting
```jsx
import { lazy, Suspense } from 'react';

const AdminPanel = lazy(() => import('./AdminPanel'));
const Reports = lazy(() => import('./Reports'));

function App() {
  return (
    <div>
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/reports" element={<Reports />} />
        </Routes>
      </Suspense>
    </div>
  );
}
```

### 2. Virtual Scrolling for Large Lists
```jsx
import { FixedSizeList as List } from 'react-window';

const VirtualizedList = ({ items }) => {
  const Row = ({ index, style }) => (
    <div style={style}>
      <ListItem item={items[index]} />
    </div>
  );

  return (
    <List
      height={600}
      itemCount={items.length}
      itemSize={60}
      width="100%"
    >
      {Row}
    </List>
  );
};
```

### 3. Memoization Strategies
```jsx
// useMemo for expensive calculations
const expensiveValue = useMemo(() => {
  return complexCalculation(data);
}, [data]);

// useCallback for stable function references
const stableCallback = useCallback(() => {
  doSomething(data);
}, [data]);

// React.memo for component memoization
const ExpensiveComponent = React.memo(({ data }) => {
  return <div>{/* Expensive rendering */}</div>;
}, (prevProps, nextProps) => {
  // Custom comparison function
  return prevProps.data.id === nextProps.data.id;
});
```

## Security Best Practices

### 1. XSS Prevention
```jsx
// ❌ DANGEROUS: Direct HTML injection
<div dangerouslySetInnerHTML={{ __html: userInput }} />

// ✅ SAFE: Sanitize or escape
<div>{sanitizeHtml(userInput)}</div>
<div>{userInput}</div> {/* React auto-escapes */}
```

### 2. Secure Data Handling
```jsx
// Use environment variables for sensitive data
const API_KEY = process.env.REACT_APP_API_KEY;

// Never expose sensitive data in client-side code
// Instead, proxy through a backend service
const fetchUserData = async () => {
  const response = await fetch('/api/user', {
    headers: {
      'Authorization': `Bearer ${await getAuthToken()}`,
    },
  });
  return response.json();
};
```

### 3. Content Security Policy
```jsx
// Implement CSP headers in your server or meta tag
<Helmet>
  <meta
    httpEquiv="Content-Security-Policy"
    content="default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';"
  />
</Helmet>
```

## Testing Patterns

### 1. Component Testing with React Testing Library
```jsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

describe('UserForm', () => {
  test('submits form with valid data', async () => {
    const mockSubmit = jest.fn();
    render(<UserForm onSubmit={mockSubmit} />);

    // Fill form
    await userEvent.type(screen.getByLabelText(/name/i), 'John Doe');
    await userEvent.type(screen.getByLabelText(/email/i), 'john@example.com');

    // Submit form
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));

    // Assert submission
    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalledWith({
        name: 'John Doe',
        email: 'john@example.com',
      });
    });
  });
});
```

### 2. Hook Testing
```jsx
import { renderHook, act } from '@testing-library/react';
import { useCounter } from './useCounter';

describe('useCounter', () => {
  test('initializes with default value', () => {
    const { result } = renderHook(() => useCounter());
    expect(result.current.count).toBe(0);
  });

  test('increments count', () => {
    const { result } = renderHook(() => useCounter());
    
    act(() => {
      result.current.increment();
    });
    
    expect(result.current.count).toBe(1);
  });
});
```

## Migration Strategies

### React 17 to 18 Migration
```jsx
// 1. Update dependencies
npm install react@18 react-dom@18

// 2. Update ReactDOM.render to ReactDOM.createRoot
// Before (React 17)
import ReactDOM from 'react-dom';
ReactDOM.render(<App />, document.getElementById('root'));

// After (React 18)
import { createRoot } from 'react-dom/client';
const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);

// 3. Update concurrent features (optional)
const root = createRoot(container, {
  // Enable concurrent features
  unstable_strictMode: true,
});
```

### Class Components to Hooks Migration
```jsx
// Before: Class Component
class UserProfile extends React.Component {
  state = { loading: false, user: null };
  
  componentDidMount() {
    this.fetchUser();
  }
  
  componentDidUpdate(prevProps) {
    if (prevProps.userId !== this.props.userId) {
      this.fetchUser();
    }
  }
  
  fetchUser = async () => {
    this.setState({ loading: true });
    const user = await api.getUser(this.props.userId);
    this.setState({ loading: false, user });
  };
  
  render() {
    const { loading, user } = this.state;
    if (loading) return <Loading />;
    return <div>{user?.name}</div>;
  }
}

// After: Functional Component with Hooks
const UserProfile = ({ userId }) => {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    let cancelled = false;
    
    const fetchUser = async () => {
      setLoading(true);
      const userData = await api.getUser(userId);
      if (!cancelled) {
        setUser(userData);
        setLoading(false);
      }
    };
    
    fetchUser();
    
    return () => {
      cancelled = true; // Cleanup
    };
  }, [userId]);
  
  if (loading) return <Loading />;
  return <div>{user?.name}</div>;
};
```

## Tooling & Ecosystem

### Essential Development Tools
```json
{
  "devDependencies": {
    "@testing-library/react": "^13.0.0",
    "@testing-library/jest-dom": "^5.16.0",
    "eslint-plugin-react": "^7.32.0",
    "eslint-plugin-react-hooks": "^4.6.0",
    "prettier": "^2.8.0",
    "@types/react": "^18.0.0"
  }
}
```

### Recommended VS Code Extensions
- ES7+ React/Redux/React-Native snippets
- React TypeScript Snippets
- Prettier - Code formatter
- ESLint
- Auto Rename Tag
- Bracket Pair Colorizer

## Community & Resources

### Official Documentation
- [React Documentation](https://react.dev/)
- [React 18 Upgrade Guide](https://react.dev/blog/2022/03/08/react-18-upgrade-guide)

### Learning Resources
- [React Patterns](https://reactpatterns.com/)
- [React.gg](https://react.gg/) - Interactive learning
- [Epic React](https://epicreact.dev/) - Advanced course

### Best Practices
- [React Best Practices](https://github.com/facebook/react/wiki/Best-Practices)
- [React Performance](https://kentcdodds.com/blog/react-performance)
- [React Testing Patterns](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)