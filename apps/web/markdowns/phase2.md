# phase-2.md

# **Phase 2: Agent Tools & Collaboration**

In this phase, we introduce the **Agent Dashboard** and collaboration features (like internal notes). Refer to **@user-flow.md** for agent needs, and use the **@tech-stack.md**, **@ui-rules.md**, and **@codebase-best-practices.md** for consistent code organization.

---

## **Relevant User Stories**
- **(6)** View Ticket Queue & Prioritize
- **(7)** Take Ownership of a Ticket
- **(8)** Collaborate with Internal Notes
- **(9)** Use AI-Suggested Responses (partially introduced here, final AI in Phase 4/5)

---

## **Feature Goals**
1. **Agent Login & Role**: Ensure agent users can sign in and see a distinct “agent” interface.  
2. **Ticket Queue**: Display open tickets in order of priority, creation time, or SLA.  
3. **Taking Ownership**: Agents can assign tickets to themselves or others.  
4. **Internal Notes**: Agents can add private notes not visible to customers.  
5. **Preliminary AI Suggestions**: Basic placeholder for AI-suggested replies (full AI logic in Phase 4).

---

## **Checklist of Tasks**

### **A. Frontend**

1. **Agent-Specific Dashboard**  
   - [ ] Create `app/agent/` directory for agent routes.  
   - [ ] Build a ticket queue view with sorting and filtering.  
   - [ ] Mark tickets as “Assigned to me,” “High Priority,” etc., using minimal visual indicators from `@theme-rules.md`.

2. **Ownership & Collaboration**  
   - [ ] Add a “Take Ownership” or “Assign to Me” button on each ticket row.  
   - [ ] Provide a text area for “Internal Notes” that is visually distinct from customer-facing comments.

3. **Preliminary AI UI Elements**  
   - [ ] Insert a placeholder panel for AI-suggested response (actual LLM logic in Phase 4).  
   - [ ] Possibly mock the suggestions with static text for now, or simple placeholders.

4. **Responsive Layout**  
   - [ ] Ensure the agent dashboard adapts well on various screen sizes.  
   - [ ] Provide a collapsible or tabbed layout for viewing assigned vs. unassigned tickets.

### **B. Backend**

1. **Agent Role & Permissions**  
   - [ ] In Supabase, define an “agent” role.  
   - [ ] Adjust RLS policies so agents can view all tickets, but only add internal notes to tickets assigned to them (or unassigned).

2. **Updating Ticket Ownership**  
   - [ ] Extend the `tickets` table with an `assigned_agent_id` column.  
   - [ ] Create/update an API route or edge function for ticket assignment logic.

3. **Internal Notes Table or Mechanism**  
   - [ ] Either use a separate `internal_notes` table or add a `private` flag to the existing `ticket_updates` table.  
   - [ ] Ensure only agents can read these notes.

4. **Initial AI Suggestion Endpoint (Stub)**  
   - [ ] Create a placeholder route that returns dummy AI suggestions.  
   - [ ] Store suggestions if needed in a table or return them on the fly.

5. **Testing & Docs**  
   - [ ] Write tests for “Assign to me” flows and confirm RLS is correct.  
   - [ ] Document new endpoints in TSDoc/JSDoc, per `@codebase-best-practices.md`.

---