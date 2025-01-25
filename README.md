# Customerly

A modern, production-ready customer support platform built with Next.js and Supabase.

## 🚀 Features

- 🔐 Authentication with Supabase
- 🎨 Modern UI with Tailwind CSS and shadcn/ui
- 📱 Fully responsive design
- 🧪 Testing setup with Jest and Cypress
- 🔄 Real-time updates
- 🎯 TypeScript support
- 📊 Analytics integration with Vercel
- 🔍 E2E and Unit testing support

## 🛠️ Tech Stack

- **Framework:** Next.js
- **Database & Auth:** Supabase
- **Styling:** Tailwind CSS, shadcn/ui
- **State Management:** TanStack Query (React Query)
- **Testing:** Jest (Unit), Cypress (E2E)
- **Analytics:** Vercel Analytics
- **Development Tools:**
  - TypeScript
  - ESLint
  - Prettier
  - Husky
  - Turborepo

## 📦 Prerequisites

- Node.js >= 18.0.0
- npm 10.9.2

## 🚀 Getting Started

1. Clone the repository:
```bash
git clone https://github.com/lmgauntlet/customerly.git
cd customerly
```

2. Install dependencies:
```bash
npm install
```

3. Copy the environment files:
```bash
cp apps/web/.env.example apps/web/.env
cp apps/web/cypress.env.example apps/web/cypress.env
```

4. Update the environment variables in `.env` with your Supabase credentials

5. Start the development server:
```bash
npm run dev
```

## 🧪 Testing

- Run unit tests:
```bash
npm test
```

- Run E2E tests with Cypress:
```bash
# Interactive mode
npm run test:e2e

# Headless mode
npm run test:e2e:headless
```

## 📝 Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run test` - Run Jest tests
- `npm run test:e2e` - Run Cypress tests
- `npm run analyze` - Analyze bundle size

## 🏗️ Project Structure

```
customerly/
├── apps/
│   └── web/              # Next.js web application
│       ├── src/          # Source code
│       ├── public/       # Static files
│       ├── cypress/      # E2E tests
│       └── markdowns/    # Documentation
├── docs/                 # Project documentation
└── turbo.json           # Turborepo configuration
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

Michael Troya ([@michaeltroya](https://twitter.com/michaeltroya))
