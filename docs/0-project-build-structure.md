# Customerly Project Structure

This document outlines the structure and setup of the Customerly monorepo project.

## Root Structure
The project is a monorepo using Turborepo, with the following main directories:

```bash
customerly/
├── apps/
│ ├── web/ # Next.js frontend application
│ ├── db/ # Database/Prisma related code
│ └── edge-functions/ # Supabase Edge Functions
├── markdowns/ # Project documentation
├── docs/ # Technical documentation
└── package.json # Root workspace configuration
```

## Key Components

### 1. Frontend (`apps/web`)
- Built with Next.js 14 (App Router)
- Uses TypeScript, Tailwind CSS, and shadcn/ui
- Following modern Next.js conventions with `src/` directory
- Key folders:
  - `src/app/` - Next.js App Router pages
  - `src/components/` - React components
  - `src/providers/` - React context providers
  - `src/lib/` - Utility functions
  - `markdowns/` - Frontend-specific documentation

### 2. Database (`apps/db`)
- Uses Prisma as ORM
- Handles database migrations and schema
- Contains seeding scripts
- Manages Supabase database connections

### 3. Edge Functions (`edge-functions`)
- Contains Supabase Edge Functions
- Written in TypeScript
- Deployed independently to Supabase

## Build & Development Setup

### Environment Requirements
- Node.js >= 18.0.0
- NPM 10.9.2
- Supabase project (for database and authentication)

### Key Scripts
```bash
# Install dependencies
npm install

# Development
turbo dev

# Build
turbo build

# Test
turbo test

# Clean
turbo clean
```

### Turborepo Configuration
- Shared build cache
- Parallel execution
- Dependency graph optimization
- Remote caching enabled

## Documentation Structure
The project maintains extensive documentation in markdown files:
- Root level documentation for overall architecture
- Package-specific documentation in respective `markdowns/` directories
- Specific guidelines for UI, routing, and technical implementation

### Key Documentation Files
- `markdowns/` - Project-wide architecture and guidelines
- `apps/web/markdowns/` - Frontend-specific documentation
- `apps/db/README.md` - Database setup and management
- `apps/edge-functions/README.md` - Edge function development guidelines

## Package Management

### NPM Workspaces
The project uses NPM workspaces with the following configuration:

```json
{
  "workspaces": [
    "apps/"
  ]
}
```

### Dependency Management
- Strict version control using exact versions
- Shared dependencies managed at root level
- Package-specific dependencies in respective `package.json` files

## TypeScript Configuration
- Strict mode enabled
- Path aliases configured for clean imports
- Consistent configuration across packages

## Testing Setup
- Jest for unit testing
- React Testing Library for component testing
- MSW for API mocking
- Consistent test configuration across packages

## Code Quality Tools
- ESLint for code linting
- Prettier for code formatting
- Husky for git hooks
- lint-staged for staged file linting

## Deployment
- Frontend deployable to Vercel
- Database managed through Supabase
- Edge functions deployed to Supabase Edge Functions

## Best Practices
1. Always use TypeScript for new code
2. Follow the established folder structure
3. Maintain consistent code formatting
4. Write tests for new features
5. Update documentation when making significant changes
6. Use conventional commits for version control

## Common Commands
```bash
# Start development servers
turbo dev

# Build all packages
turbo build

# Run tests across all packages
turbo test

# Clean build artifacts
turbo clean

# Format code
turbo format

# Lint code
turbo lint

# Reset the database
turbo db:reset
```

### Development Workflow
1. Start the development environment:
   ```bash
   turbo dev
   ```

2. Make your changes and verify the build:
   ```bash
   turbo build
   ```

3. Run tests to ensure nothing is broken:
   ```bash
   turbo test
   ```

4. Before committing, format and lint your code:
   ```bash
   turbo format
   turbo lint
   ```

## Additional Resources
- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.io/docs)
- [Turborepo Documentation](https://turbo.build/repo/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com)