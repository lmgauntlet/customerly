# **Routing Logic**

Below is a brief outline of how **Customerly** should handle routing, based on user authentication state and role.

---

## **1. Not Signed-In: Main (Public) Pages**

- **Route**: `"/"` (homepage or main landing page)  
- **Behavior**:  
  - If the user is **not** signed in, they remain on the public homepage or see content intended for unauthenticated users.  
  - This could include a simple marketing page, a “Login” or “Sign Up” prompt, and any publicly accessible resources (e.g., FAQs, knowledge base previews).

---

## **2. Signed-In as Admin or Agent**

- **Route**: `"/agent/dashboard"` (agent dashboard landing page)  
- **Behavior**:  
  - If the user is **signed in** and their role is **admin** or **agent**, they are routed to the internal **agent interface**.  
  - This interface typically includes the **ticket queue**, administrative dashboards, or relevant role-based pages (e.g., “Teams” or “Routing Rules” for admins).

---

## **3. Signed-In as Customer**

- **Route**: `"/customer/tickets"` (customer landing page)  
- **Behavior**:  
  - If the user is **signed in** but **not** an admin/agent, they are considered a **customer**.  
  - They see a **customer portal** where they can create tickets, view ticket statuses, or access basic account settings.

---

## **4. System Flow**

1. **User Enters the Site**  
   - If **not authenticated**, stay on `"/"` or **public** pages.  
   - If authenticated, proceed to **role check**.

2. **Role Check**  
   - **Admin/Agent**: Redirect to `"/agent/dashboard"`.  
   - **Customer**: Go to `"/customer/tickets"` (or whichever route is your standard customer entry point).

3. **Protected Routes**  
   - Any route under `"/agent"` requires **agent** or **admin** privileges.  
   - Ensure **Row-Level Security** and role-based checks at the database or API level to prevent unauthorized data access.

---

## **5. Potential Implementation Details**

### **In Next.js (App Router)**

1. **Middleware** (optional)  
   - Create a file like `middleware.ts` at the root of your project.  
   - Read the Supabase auth session to determine if a user is logged in.  
   - If user lacks authentication, redirect to `"/"`.  
   - If user is agent/admin, route to `"/agent/dashboard"` as the default after sign-in.  
   - If user is a customer, route to `"/customer/tickets"`.

2. **Client-Side Checks**  
   - Use a custom hook (e.g., `useUser`) that returns user role info.  
   - In pages or components, if the role is **agent** or **admin**, direct them to the agent interface; otherwise, show the customer pages.

---

## **Summary**

- **Unauthenticated** users see the main/public landing page.  
- **Authenticated Admin/Agent** users automatically go to the **agent interface** (`"/agent/dashboard"`).  
- **Authenticated Customers** go to a **customer portal** (e.g., `"/customer/tickets"`).  
- **Middleware** or **client-side checks** enforce these rules, ensuring each user sees the correct interface based on their role.


# **Routing Best Practices for Customerly Next.js Application**

This document outlines the **best practices** for structuring and handling routing within the **Customerly** Next.js application. Leveraging insights and standards from the past three years, these guidelines ensure a **modular**, **scalable**, and **maintainable** codebase that aligns with our **AI-first** and **minimalist** design principles.

---

## **1. Utilize Next.js App Router**

With the advent of Next.js 13 and beyond, the **App Router** introduces enhanced routing capabilities. For Customerly, adopting the App Router ensures:

- **Nested Layouts**: Facilitate shared UI elements (like navigation bars) across multiple pages.
- **Server and Client Components**: Optimize performance by leveraging server-side rendering where appropriate.
- **Enhanced Routing Patterns**: Simplify dynamic and nested routes.

### **Implementation Tips**

- **Directory Structure**: Organize routes within the `app/` directory, using nested folders for hierarchical routes.
- **File Naming**: Use clear and descriptive names for route segments. For dynamic routes, utilize square brackets (e.g., `[ticketId]`).

---

## **2. Implement Middleware for Authentication and Authorization**

**Middleware** in Next.js allows you to run code before a request is completed. For Customerly, middleware will enforce access control based on authentication status and user roles.

### **Best Practices**

1. **Centralized Authentication Check**
   - Place middleware at the root of the `app/` directory to handle authentication globally.
   - Redirect unauthenticated users to the main landing page (`"/"`).

2. **Role-Based Access Control (RBAC)**
   - After verifying authentication, check the user's role (admin, agent, customer).
   - Redirect users to appropriate dashboards based on their roles:
     - **Admins/Agents**: Redirect to `"/agent/dashboard"`.
     - **Customers**: Redirect to `"/customer/tickets"`.

3. **Performance Optimization**
   - Keep middleware lightweight to minimize latency.
   - Avoid heavy computations or unnecessary database calls within middleware.


3. Define Clear and Consistent Route Structures

A well-organized route structure enhances navigability and maintainability. For Customerly, segregate routes based on user roles and functionalities.

Recommended Route Hierarchy

```plaintext
app/
├── page.tsx                  # Main Landing Page
├── login/
│   └── page.tsx              # Login Page
├── signup/
│   └── page.tsx              # Signup Page
│   ├── page.tsx              # Customer Tickets Dashboard
│   └── [ticketId]/
│       └── page.tsx          # Ticket Details Page
├── agent/
│   ├── layout.tsx            # Agent Layout with Navigation
│   ├── dashboard/
│   │   └── page.tsx          # Agent Dashboard
│   ├── tickets/
│   │   ├── page.tsx          # Agent Ticket Queue
│   │   └── [ticketId]/
│   │       └── page.tsx      # Agent Ticket Details
│   └── settings/
│       └── page.tsx          # Agent/Admin Settings
├── api/
│   ├── auth/
│   │   └── [...supabase].ts # Supabase Auth API
│   └── tickets/
│       └── route.ts           # Ticket Management API
└── layout.tsx                # Global Layout
```

Key Points
	•	Role-Based Prefixes: Use /agent for admin and agent-specific routes, ensuring clear separation from customer-facing routes. Use /customer for customer-facing routes.
	•	Dynamic Routes: Implement dynamic routing for individual tickets using [ticketId].
	•	Nested Layouts: Utilize nested layouts for shared UI components within agent/admin sections.

4. Leverage Nested Layouts for Shared UI Components

Nested layouts promote DRY (Don’t Repeat Yourself) principles by allowing shared components like headers, footers, and navigation bars across multiple pages.

Implementation Steps
	1.	Global Layout
	•	Define a global layout in app/layout.tsx for public pages.
	•	Include shared components like the main navigation bar or footer.
	2.	Agent Layout
	•	Create a separate layout in app/agent/layout.tsx for all agent/admin routes.
	•	Incorporate agent-specific navigation menus and sidebars.


4. Leverage Nested Layouts for Shared UI Components

Nested layouts promote DRY (Don’t Repeat Yourself) principles by allowing shared components like headers, footers, and navigation bars across multiple pages.

Implementation Steps
	1.	Global Layout
	•	Define a global layout in app/layout.tsx for public pages.
	•	Include shared components like the main navigation bar or footer.
	2.	Agent Layout
	•	Create a separate layout in app/agent/layout.tsx for all agent/admin routes.
	•	Incorporate agent-specific navigation menus and sidebars.

Sample Agent Layout

```tsx
// app/agent/layout.tsx
import AgentSidebar from '@/components/agent/AgentSidebar';
import AgentHeader from '@/components/agent/AgentHeader';

export default function AgentLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex">
      <AgentSidebar />
      <div className="flex-1">
        <AgentHeader />
        <main>{children}</main>
      </div>
    </div>
  );
}
```

6. Optimize for Performance with Code Splitting and Caching
Efficient routing not only improves user experience but also enhances application performance.

Best Practices
	1.	Dynamic Imports
	•	Use dynamic imports to load components only when needed, reducing initial load times.
	•	Example:
```tsx
import dynamic from 'next/dynamic';
const AgentDashboard = dynamic(() => import('@/components/agent/AgentDashboard'), { ssr: false });
```

	2.	Static Generation (SSG) and Server-Side Rendering (SSR)
	•	Utilize SSG for pages that don’t require real-time data.
	•	Use SSR for dynamic pages that need up-to-date information, such as ticket details.
	3.	Caching Strategies
	•	Implement caching for API responses where appropriate using Cache-Control headers.
	•	Leverage Next.js Incremental Static Regeneration (ISR) to update static content without full redeploys.

7. Maintain a Scalable Folder Structure

A logical and scalable folder structure facilitates easier navigation and maintenance as the project grows.

Recommended Structure

Key Considerations
	•	Feature-Based Organization: Group related functionalities (e.g., customer tickets, agent dashboard) within their own directories.
	•	Separation of Concerns: Keep API routes, frontend pages, and shared components distinct to avoid clutter.
	•	Scalability: Design the structure to accommodate future features without significant refactoring.

9. Implement Robust Error Handling and Redirects
Ensure that the application gracefully handles errors and provides meaningful feedback to users.

Best Practices
	1.	Custom 404 and 500 Pages
	•	Create custom error pages to maintain brand consistency.
	•	Example:
```plaintext
app/
├── 404.tsx
└── 500.tsx
```

2.	Redirects and Rewrites
•	Define redirects in next.config.js for deprecated routes or to enforce HTTPS.
•	Example:
```javascript
// next.config.js
module.exports = {
  async redirects() {
    return [
      {
        source: '/old-route',
        destination: '/new-route',
        permanent: true,
      },
    ];
  },
};
```
3.	Error Boundaries
	•	Utilize React error boundaries to catch and handle component-level errors.
	•	Example:

```tsx
// components/ErrorBoundary.tsx
import React, { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
```