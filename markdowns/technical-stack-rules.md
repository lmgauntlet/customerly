# **Technology Choices for this app**

This document specifies the selected technology stack for app. Each choice outlines how components will be used in the project.

---

## **1. Authentication: Supabase Auth**

- **Usage**  
  - Manage user registration, login, session handling, and password resets.  
  - Store user credentials and profiles in Supabase.  
  - Implement role-based logic within Supabase for different user types.

---

## **2. File Storage: Supabase Storage**

- **Usage**  
  - Store and serve file attachments (e.g., images, PDFs) for tickets.  
  - Configure bucket-level access rules to ensure private or public availability.  
  - Link uploaded files to ticket records in the database.

---

## **3. Database: Supabase Postgres**

- **Usage**  
  - Maintain all relational data (tickets, users, metadata) in Postgres.  
  - Run schema migrations for versioned updates.  
  - Leverage Postgres features for advanced queries and indexing.

---

## **4. Frontend: Next.js + DaisyUI**

- **Usage**  
  - Build the user interface with Next.js for server-side rendering and routing.  
  - Style UI elements and pages with DaisyUI, extending Tailwind CSS for consistent component design.  
  - Organize code in a modern React-based structure.

---

## **5. Deployment: Amplify + GitHub**

- **Usage**  
  - Store code in a GitHub repository and enable automatic CI/CD with Amplify.  
  - Trigger builds and deployments on commits or pull requests.  
  - Host the Next.js app on Amplify for scalable performance.

---

## **6. Backend: Supabase Edge Functions in a Monorepo**

- **Usage**  
  - Manage serverless business logic within a single monorepo.  
  - Deploy Supabase edge functions for real-time or scheduled operations.  
  - Keep shared code and type definitions in one repository for easy maintenance.

---

## **Overall Implementation Flow**

1. **Users** authenticate through Supabase Auth.  
2. **Data** is persisted in Supabase Postgres.  
3. **Files** are stored in Supabase Storage.  
4. **Frontend** is powered by Next.js and styled with DaisyUI.  
5. **Deployment** is managed via Amplify with GitHub as the source.  
6. **Serverless Functions** run on Supabase Edge Functions within the same monorepo.

This approach integrates all components to streamline development, reduce complexity, and maintain a unified codebase. 
