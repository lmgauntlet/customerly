# phase-1.md

# **Phase 1: Basic Customer Portal & Ticket Creation**

This document outlines the first phase of building the Customerly CRM, focusing on the **Customer Portal** where end users can submit tickets, view statuses, and update them. Refer to **@user-flow.md**, **@ui-rules.md**, **@theme-rules.md**, and **@codebase-best-practices.md** for design and code structure requirements.

---

## **Relevant User Stories**
- **(1)** Submit Ticket (Basic)
- **(2)** View & Track Ticket Status
- **(3)** Update Ticket with Additional Info

---

## **Feature Goals**
1. **Customer Signup/Login**: Basic auth flow via Supabase to create a new customer account or log in.
2. **Ticket Submission**: A form for creating a support ticket with fields (subject, description, attachments).
3. **Ticket Status Viewing**: A dashboard or list view where customers can see open/resolved tickets.
4. **Ticket Updates**: Ability for customers to add new info (screenshots, logs) after ticket creation.

---

# **Customerly Agent Screens in Phase 1**

Below is a high-level overview of what an **agent** interface typically looks like in **Customerly**, **tailored** to **Phase 1** of our project. Because **Phase 1** focuses on **customer-facing** flows (ticket creation, status tracking), the agent experience here is minimal. However, understanding these foundational screens sets the stage for later phases.

---

## **1. Agent Login & Landing**

1. **Login Screen**  
   - Agents enter their credentials and are routed to an internal dashboard or placeholder page.  
   - **Phase 1**: May only have a basic or shared login for all user types (customer, agent, admin). Agents can log in but see limited functionality.

2. **Minimal Dashboard (Optional)**  
   - In a fully featured Customerly environment, agents often land on a home screen or ticket overview.  
   - **Phase 1**: We might only display a basic “Welcome” or “Agent Portal” page without full metrics or queue stats. Comprehensive agent features come in **later** phases.

---

## **2. Ticket List / Queue (Preview)**

Even in Phase 1, we can anticipate a simple ticket list:

1. **Ticket Summary Rows**  
   - **Subject**: Short summary of the issue.  
   - **Customer**: Name or email of the requester.  
   - **Status**: Basic status (e.g., Open, Pending, Resolved).  
   - **Last Updated**: Timestamp of the latest message.

2. **Filters & Sorting**  
   - Sorting by **date**, **priority**, or **SLA** is common, though might be postponed until a later phase.  
   - **Phase 1** could show a minimal list, with no advanced filtering.

---

## **3. Ticket Details Screen (Basic)**

When an agent **opens** a specific ticket, they typically see:

1. **Ticket Info**  
   - **Subject** & **Description**  
   - **Customer’s Name & Email**  
   - **Created At** / **Updated At** timestamps

2. **Conversation Threads**  
   - All messages (customer or agent) appear in a timeline.  
   - **Phase 1**: Could be very bare-bones, possibly just showing the initial description. Full replies or internal notes might come in subsequent phases.

3. **Action Buttons**  
   - **Reply**: If included in Phase 1, sends a response to the customer.  
   - **Change Status**: Transition from “Open” to “Pending” or “Resolved.”  
   - **Assign to Agent**: Usually introduced in later phases, not strictly needed in Phase 1.

---

## **4. Missing (or Limited) Phase 1 Features**

- **No Advanced Collaboration**  
  - Internal notes, collision detection, or private agent channels typically appear later.

- **No Automated Routing or Priority**  
  - Complex automations or SLAs are usually Phase 2 or beyond.

- **No AI Suggestions**  
  - Phase 1 focuses on ticket creation and basic viewing. AI features will come in **future** phases.

---

## **Proposed Routes**

For **Phase 1**, below are some minimal Next.js (App Router) paths or similar structure:

1. **`/agent/login`**  
   - A dedicated login screen for agents (or shared login page with role-based routing).

2. **`/agent/dashboard`**  
   - Basic landing page showing an “Agent Portal” or minimal ticket overview.

3. **`/agent/tickets`**  
   - A list of all tickets available for agents to view (simple table or list format).

4. **`/agent/tickets/[ticketId]`**  
   - A details page showing subject, description, customer info, and basic conversation history.  
   - Could include a “Reply” action if we implement that in Phase 1.

> **Note**: These routes may remain static or partially implemented in Phase 1, as **most** of the functionality in this phase centers on the **customer-facing** side (ticket submission, status tracking). We include these agent routes to set the foundation for expanded features in subsequent phases.

---

## **Summary**

In **Phase 1**, the **agent** interface within **Customerly** is minimal. Agents may only have a rudimentary dashboard or ticket list, enough to see newly submitted tickets from customers. Additional collaboration, automation, and AI-based features will be introduced in **later** phases. 

---

## **Checklist of Tasks**

### **A. Frontend**

1. **Customer Auth Pages**  
   - [ ] Create minimal login and signup pages using Next.js (App Router).  
   - [ ] Integrate Supabase Auth to handle session management.  
   - [ ] Apply **Minimalist** theme from `@theme-rules.md` (layout, color palette, form styling).

2. **Ticket Submission Form**  
   - [ ] Build a form in `app/tickets/create/` for users to input subject, description, and attachments.  
   - [ ] Validate required fields (subject, description) with inline error messages.  
   - [ ] Follow **UI** guidelines from `@ui-rules.md` regarding field spacing and accessibility.

3. **Ticket List/Status Page**  
   - [ ] Create a page in `app/tickets/` that displays all tickets for the logged-in user.  
   - [ ] Show basic info: ticket ID, subject, status, last updated.  
   - [ ] Provide a simple search/filter for ticket status (e.g., open, pending, resolved).

4. **Update Ticket Page**  
   - [ ] Create a page (e.g., `app/tickets/[id]/`) that shows ticket details and allows additional info (files, comments).  
   - [ ] Ensure new attachments or notes are appended in real-time or on refresh.  

5. **Styling & Responsiveness**  
   - [ ] Test pages across breakpoints (mobile, tablet, desktop).  
   - [ ] Maintain consistency with `@theme-rules.md` for colors and typography.

### **B. Backend**

1. **Database Schema**  
   - [ ] In Supabase (or local dev environment), define a `tickets` table with columns for:  
     - `id` (primary key), `user_id` (foreign key), `subject`, `description`, `status`, `created_at`, `updated_at`.  
   - [ ] Setup a `ticket_updates` or `messages` table for storing follow-up info (e.g., attachments, comments).  
   - [ ] Generate migrations using Prisma (`prisma migrate`) and commit them per `@codebase-best-practices.md`.

2. **Supabase Auth Integration**  
   - [ ] Ensure Row-Level Security (RLS) so customers can only see and modify their own tickets.  
   - [ ] Validate tokens on server components or edge functions as needed.

3. **API Routes / Edge Functions**  
   - [ ] Create an API route (or Supabase Edge Function) for **creating tickets**.  
   - [ ] Create an API route (or function) for **retrieving user tickets**.  
   - [ ] Create an API route (or function) for **updating** existing tickets.

4. **File Storage**  
   - [ ] Utilize Supabase Storage for attachments.  
   - [ ] Link attachment records to `ticket_updates` in the DB.

5. **Testing & Documentation**  
   - [ ] Write unit tests for ticket creation flows and update flows.  
   - [ ] Document all endpoints and expected params in the code with JSDoc/TSDoc.

---