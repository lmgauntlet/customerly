# Agent Dashboard Development Guidelines

## Cursor Rules
- 

## Tech Stack
- Next.js 14 (App Router)
- Supabase (Auth & Storage)
- ShadowcN UI
- TailwindCSS
- TypeScript (strict mode)

## Core Development Rules

### 1. Authentication Simplification
- Skip RBAC implementation until final phase
- All pages accessible if route exists
- Use service role in development
- Default admin: `lmgauntlet@gmail.com`

### 2. Data Layer Standards
- Use Supabase for all CRUD operations
```typescript
// Example Supabase query pattern
const { data, error } = await supabase
  .from('tickets')
  .select('*')
  .eq('status', 'open')
  .order('created_at', { ascending: false })
```

### 3. Development Environment
```typescript
// config/supabase.ts
export const createClientConfig = {
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL!,
  supabaseKey: process.env.NODE_ENV === 'development' 
    ? process.env.NEXT_SUPABASE_SERVICE_ROLE_KEY!
    : process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
}
```

### 4. Routing & Dashboard Architecture
- All agent-facing routes go under `apps/agent/`
- Customer-facing routes go under `apps/web/`
- Admin features extend agent dashboard functionality
- Each route should have its own directory with:
  ```
  apps/agent/src/app/[route]/
  ├── page.tsx
  ├── layout.tsx
  ├── loading.tsx
  └── components/
  ```
- Agent dashboard is primary focus
- Admin features extend agent dashboard
- Customer dashboard development deferred
- Maintain strict separation between interfaces

### 5. Development Flow
1. Route Structure
   - Define page routes
   - Setup layouts
   - Implement middleware

2. Components
   - Build page components 
   - Create shared components
   - Implement ShadowcN UI

3. API Layer
   - Define API routes
   - Implement handlers
   - Add type safety

4. Testing
   - Unit tests
   - Integration tests
   - E2E testing

### 6. Component Guidelines
- Use ShadowcN UI components by default
- Create shared components for repeated patterns
- Follow atomic design principles

## Development Optimizations

### Project Structure
```
apps/
├── web/
│   └── src/
│       ├── app/
│       │   ├── (auth)/
│       │   └── (dashboard)/
└── agent/
    └── src/
        ├── app/
        │   ├── tickets/
        │   ├── customers/
        │   └── settings/
│   ├── components/
│   │   ├── ui/
│   │   └── shared/
│   ├── lib/
│   │   ├── supabase.ts
│   │   └── test-utils.ts
│   └── types/
```

### Development Utils
```typescript
// lib/test-utils.ts
export const mockAuthContext = {
  user: {
    email: 'lmgauntlet@gmail.com',
    role: 'admin'
  }
}

// lib/debug-panel.tsx
export const DebugPanel = () => {
  if (process.env.NODE_ENV !== 'development') return null
  return (
    <div className="fixed bottom-4 right-4 p-4 bg-slate-900 text-white">
      <h3>Debug Panel</h3>
      <pre>{/* Debug info */}</pre>
    </div>
  )
}
```

### Local Development Tips

#### Feature Flags
```typescript
// config/features.ts
export const FEATURES = {
  NEW_TICKET_FLOW: process.env.NEXT_PUBLIC_FEATURE_NEW_TICKET === 'true',
  EXPERIMENTAL_UI: process.env.NODE_ENV === 'development'
}
```

#### Hot Reloading
```typescript
// next.config.js
module.exports = {
  webpack: (config) => {
    config.watchOptions = {
      poll: 1000,
      aggregateTimeout: 300
    }
    return config
  }
}
```

#### Path Aliases
```typescript
// tsconfig.json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@components/*": ["src/components/*"],
      "@lib/*": ["src/lib/*"]
    }
  }
}
```

### API Mocking
```typescript
// src/mocks/handlers.ts
import { rest } from 'msw'

export const handlers = [
  rest.get('/api/tickets', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        tickets: [
          // Mock data
        ]
      })
    )
  })
]
```

### Testing Setup
```typescript
// jest.setup.ts
import '@testing-library/jest-dom'
import { server } from './src/mocks/server'

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())
```

## Component Development
- Use Storybook/Ladle for isolated component development
- Create component variations with different props
- Document component APIs
- Include accessibility tests

## Type Safety
```typescript
// types/supabase.ts
export type Database = {
  tickets: {
    Row: {
      id: string
      title: string
      status: 'new' | 'open' | 'closed'
      // ...other fields
    }
    Insert: Pick<Row, 'title' | 'status'>
    Update: Partial<Row>
  }
  // ...other tables
}
```
