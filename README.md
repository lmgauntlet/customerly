# Customerly

A modern customer support platform built with Next.js and Supabase.

## Features

- 🚀 Next.js 14 with App Router
- 🎨 Tailwind CSS + shadcn/ui
- 🔒 Supabase Auth
- 📦 Turborepo
- 🧪 Testing setup with Jest and Playwright
- 🔄 React Query for data fetching
- 📝 TypeScript for type safety

## Tech Stack

- **Framework:** Next.js 14
- **Styling:** Tailwind CSS + shadcn/ui
- **Database:** Supabase
- **Authentication:** Supabase Auth
- **State Management:** React Query
- **Testing:** Jest (Unit), Playwright (E2E)
- **Build Tool:** Turborepo
- **Language:** TypeScript

## Getting Started

### Prerequisites

- Node.js >= 18
- npm >= 10.9.2
- Supabase project

### Installation

1. Clone the repository:

```bash
git clone https://github.com/lmgauntlet/customerly.git
cd customerly
```

2. Install dependencies:

```bash
npm install
```

3. Copy environment files:

```bash
cp apps/web/.env.example apps/web/.env
cp apps/db/.env.example apps/db/.env
cp apps/web/test.env.example apps/web/test.env
```

4. Update the environment files with your Supabase credentials

5. Run the development server:

```bash
npm run dev
```

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run test` - Run Jest tests
- `npm run test:e2e` - Run Playwright tests

### Project Structure

```
customerly/
├── apps/
│   ├── web/           # Next.js frontend
│   │   ├── src/
│   │   │   ├── app/        # Next.js App Router
│   │   │   ├── components/ # React components
│   │   │   └── lib/       # Utility functions
│   │   ├── e2e/           # Playwright tests
│   │   └── public/        # Static files
│   └── db/            # Database layer
│       ├── prisma/    # Prisma schema
│       └── seeds/     # Database seeds
└── packages/         # Shared packages
```

## Testing

### Unit Tests

```bash
npm run test
```

### E2E Tests

```bash
npm run test:e2e
```

## Contributing

1. Create a feature branch
2. Commit your changes
3. Push to the branch
4. Open a Pull Request

## License

This project is licensed under the MIT License.

## Supabase Setup

1. Create Project & Get Credentials

   ```bash
   # Save these from Supabase Dashboard
   DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT-ID].supabase.co:5432/postgres"
   DIRECT_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT-ID].supabase.co:5432/postgres"
   NEXT_PUBLIC_SUPABASE_URL="https://[PROJECT-ID].supabase.co"
   NEXT_PUBLIC_SUPABASE_ANON_KEY="[ANON-KEY]"
   SUPABASE_SERVICE_ROLE_KEY="[SERVICE-ROLE-KEY]"
   ```

2. Create Test User & Update Env

   ```bash
   # Add to test.env
   TEST_USER_EMAIL="[EMAIL]"
   TEST_USER_PASSWORD="[PASSWORD]"
   ```

3. Create Storage Bucket

   ```bash
   # In Supabase Dashboard
   Storage > New Bucket > Name: "customerly"
   ```

4. Initialize Database & Storage

   ```bash
   # Reset and seed database
   cd packages/db
   ./reset-and-seed.sh test   # For test db

   # Apply storage policies
   cd ../apps/web
   npm run storage:policies
   ```

⚠️ Notes:

- Never expose service role key in client code
- Use separate databases for test/prod
- Backup before running reset scripts
