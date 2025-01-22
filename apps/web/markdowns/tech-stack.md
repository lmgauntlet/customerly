# **tech-stack-rules.md**

This document outlines **best practices**, **limitations**, and **conventions** for the core technologies we’re using in our **Customerly** application, based on the SupaNext Starter kit. All team members and AI agents must follow these guidelines to ensure consistency, maintainability, and reliability.

---

## **1. Next.js 14 (App Router)**

### **Best Practices**
1. **File-based Routing**  
   - Use the new App Router (`app/` directory) for a clear, convention-based layout.  
   - Group related route functionality using nested directories to keep the code organized.
2. **Server Components**  
   - Leverage server components for data fetching when possible, reducing the client-side bundle size.  
   - Only move to client components if you need interactivity or React hooks that run in the browser.
3. **Performance Optimizations**  
   - Use **dynamic** or **static** segment configurations to handle data fetching patterns effectively.  
   - Pre-render essential pages for better SEO and user experience.  
   - Add caching strategies (`revalidate` settings) where beneficial.
4. **Middleware**  
   - Employ Next.js Middleware for tasks like authentication checks or rewrites when operating at the edge.  
   - Keep middleware minimal; it runs before every request.

### **Limitations**
- **App Router vs. Pages Router**: This starter kit uses the **App Router** by default. Mixing Pages (`pages/`) and App Router can cause confusion—avoid unless absolutely necessary.  
- **Edge Cases**: Some Next.js features (like middleware) might conflict with advanced Supabase SSR flows. Test thoroughly when combining them.

### **Common Pitfalls**
- **Misconfiguring SSR**: Supabase SSR requires correct usage of session tokens and environment variables. Ensure you initialize Supabase properly in server components.  
- **Excessive Client Components**: Overuse increases bundle size and slows down the app. Convert to server components where possible.

---

## **2. Supabase with supabase-ssr**

### **Best Practices**
1. **Use the Official Client**  
   - Import and configure **`createClient`** from `@supabase/supabase-js`.  
   - Store credentials (URL, Anon/Public Key) in `.env.local` under `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
2. **Secure RLS & Policies**  
   - Protect tables and data using **Row-Level Security**.  
   - Implement policies that limit data visibility based on JWT claims.  
3. **Server-Side Rendering (SSR)**  
   - For secure data fetching, do it **on the server** using SSR (or the new App Router server components).  
   - Pass session data as needed to client components without exposing sensitive keys.

### **Limitations**
- **Anon Key**: Must remain public, so store it in `NEXT_PUBLIC_SUPABASE_ANON_KEY`. Don’t include service_role keys in front-end code.  
- **Rate Limits**: Supabase enforces rate limits. Cache or batch requests where possible to avoid hitting limits.

### **Common Pitfalls**
- **Mixing Keys**: Accidentally using **service_role** or private keys on the client side leads to security risks.  
- **Auth State Management**: Not properly syncing the client-side and server-side auth states can cause flickers or stale sessions.

---

## **3. React 18**

### **Best Practices**
1. **Concurrent Features**  
   - Familiarize yourself with [React 18’s concurrency model](https://reactjs.org/docs/concurrent-mode-intro.html).  
   - Use transitions or suspense effectively where needed (e.g., data fetching flows).
2. **Strict Mode**  
   - Keep **strict mode** enabled in development to highlight potential side effects or warnings early.

### **Limitations**
- **Concurrent Rendering**: Some older libraries may not yet support concurrent rendering fully—check library compatibility.
- **Suspense for Data Fetching**: Not every data fetch scenario is trivially integrated with Suspense. Test thoroughly.

### **Common Pitfalls**
- **Double Invocations**: In **development**, React 18’s Strict Mode might cause double rendering of certain components, confusing logs. This is expected behavior in dev only.

---

## **4. TypeScript**

### **Best Practices**
1. **Strict Mode**  
   - Enable `"strict": true` in `tsconfig.json` to catch more errors.  
   - Avoid using `any` unless absolutely necessary.
2. **Path Aliases**  
   - Use `@/` prefix for importing. For example:  
     ```ts
     import { Button } from '@/components/ui/button'
     ```
3. **Types & Interfaces**  
   - For library or environment definitions, use the appropriate type definitions.  
   - Define domain-specific types in separate files or modules for clarity (e.g., `types/User.ts`).

### **Limitations**
- **Third-Party Types**: Some libraries may have incomplete or outdated type definitions. If you hit issues, contribute fixes or create your own `.d.ts` files.

### **Common Pitfalls**
- **Ignoring Type Errors**: Don’t use `@ts-ignore` unless you have a valid reason. Try fixing or refining types first.

---

## **5. npm**

### **Best Practices**
1. **Workspace Management**  
   - Use npm’s workspaces feature for multi-package management if needed, but keep the main project as a single app if that suits your current structure.
2. **Lockfile**  
   - Commit `npm-lock.yaml` to ensure reproducible installs across environments.

### **Limitations**
- **Compatibility**: Some older tooling might assume npm or yarn. If you encounter issues, check if a plugin or config is required for npm.

### **Common Pitfalls**
- **Global Installs**: Avoid installing dependencies globally. Instead, specify them in your `devDependencies`.

---

## **6. Tailwind & shadcn/ui**

### **Best Practices**
1. **Utility-First CSS**  
   - Embrace Tailwind’s approach. Keep style definitions minimal in CSS files; rely on utilities in JSX.
2. **shadcn/ui Components**  
   - Prefer copying over needed components from [ui.shadcn.com](https://ui.shadcn.com/) into your codebase.  
   - Customize them carefully for consistent design across the app.
3. **Dark Mode**  
   - Use the `next-themes` library to handle theme toggling.  
   - Test color contrast in both light/dark themes for accessibility.

### **Limitations**
- **Overriding Shadcn**: Overly customizing shadcn/ui can lead to a confusing mix of default and custom styles. Keep track of your overrides.

### **Common Pitfalls**
- **Unused CSS**: Tailwind can purge unused classes automatically, but ensure you don’t inadvertently remove needed classes by dynamically constructing class names.

---

## **7. Testing (Jest + React Testing Library + MSW)**

### **Best Practices**
1. **Unit Tests**  
   - Use **Jest** with **React Testing Library** for component testing.  
   - Keep test files alongside the components or in a `__tests__` folder.
2. **Mocking Network Requests**  
   - Use **MSW** to intercept fetch/HTTP calls during tests.  
   - Keep your tests free from real network dependencies—makes them faster and more predictable.

### **Limitations**
- **SWC + Jest**: Some advanced Babel config might not work with SWC. Check compatibility if you add plugins.

### **Common Pitfalls**
- **Not Resetting Mocks**: Always reset/restore mocks in a `beforeEach` or `afterEach` block to prevent test contamination.  
- **Skipping Integration**: If you only test small units, you may miss broader edge cases where components interact with each other.

---

## **8. TanStack Query (v5)**

### **Best Practices**
1. **Client-Side Data**  
   - Store short-lived or frequently updated data (like user sessions, small data sets) in **TanStack Query**’s cache.  
   - Keep critical or large data fetching logic in Next.js server components if possible.
2. **Query Keys**  
   - Use clear, descriptive query keys (e.g., `['user', userId]`) for caching.  
   - Invalidate queries appropriately after mutations to refresh stale data.
3. **Optimistic Updates**  
   - For user-friendly UIs, implement optimistic updates on writes. Revert if the server rejects.

### **Limitations**
- **Server Components**: TanStack Query is client-side. For SSR data fetching, carefully decide which queries to run on the server vs. the client.

### **Common Pitfalls**
- **Stale Data**: Failing to invalidate or refetch queries after a mutation leads to outdated UI.  
- **Over-Fetching**: Excessive automatic refetches. Tune refetch intervals and stale times.

---

## **9. Code Quality & Tooling**

### **ESLint & Prettier**
- Use the provided ESLint config to catch errors and maintain consistent code style.  
- Prettier is configured to handle formatting. Don’t manually fix alignment or spacing—run `npm format` or enable auto-format in your editor.

### **Husky & lint-staged**
- Runs lint checks and format checks before commits.  
- Don’t bypass these checks unless absolutely necessary; it helps keep the main branch stable.

### **Bundle Analysis**
- If performance issues arise, run `npm analyze` to see a breakdown of your bundles.

---

## **10. Deployment & CI**

### **Best Practices**
1. **GitHub Actions**  
   - Use the existing workflow to run type checks, tests, and lints on pull requests.  
   - Ensure all checks pass before merging.
2. **Environments**  
   - Typically have separate environment variables (`.env.local` vs. production environment).  
   - Validate your environment config in the CI logs before deploying.

### **Limitations**
- **Edge Cases**: Some AWS or Vercel-specific features require extra config. If you run into a mismatch, review docs for the hosting environment.

### **Common Pitfalls**
- **Forgetting Env Vars**: Deployments often fail if you don’t set `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, etc., on the hosting platform.  
- **Skipping Tests**: Merging code that hasn’t gone through the test suite can break production unexpectedly.

---

## **Conclusion**

Following these **best practices**, **limitations**, and **common pitfalls** ensures that our **Customerly** project remains maintainable, secure, and high-performing. 

### **Key Points Recap**
1. **Next.js App Router**: Use server components when possible, keep pages minimal, watch out for SSR conflicts.  
2. **Supabase**: RLS is mandatory for secure data, place keys in the correct env variables, and avoid mixing service keys on the client.  
3. **React 18**: Embrace concurrency features, watch out for dev-mode double render.  
4. **npm**: Use lockfiles for consistent installs, avoid mixing npm/yarn.  
5. **Tailwind + shadcn/ui**: Keep styling utility-based, unify design, watch overrides.  
6. **Testing**: Rely on Jest + React Testing Library + MSW; mock networks, maintain good coverage.  
7. **TanStack Query**: Cache data effectively, update stale data properly.  
8. **Tooling**: ESLint, Prettier, Husky, lint-staged to enforce code quality.  
9. **CI**: Don’t ignore type checks, tests, and linting; consistently configure environment variables.

By adhering to these guidelines, our project will maintain a professional codebase that’s easy to collaborate on and extend as Customerly scales.