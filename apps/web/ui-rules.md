# ui-rules.md

Below are the **visual and interaction guidelines** for building the **Customerly** UI components, leveraging our **user-flow** (ticket creation, agent dashboards, admin controls) and our **tech stack** (Next.js, Supabase, etc.) in a **minimalist** style. These guidelines focus on **responsiveness**, **accessibility**, and **clarity**—ensuring an easy-to-understand interface that ties in smoothly with our backend infrastructure.

---

## **1. Core Design Principles**

1. **Minimalism First**  
   - Keep pages and components free of unnecessary elements.  
   - Limit color usage to a small, consistent palette (see `theme-rules.md` for specifics).  
   - Use whitespace generously to highlight key actions like “Submit Ticket” or “Assign to Me.”

2. **Responsive Layout**  
   - Follow **mobile-first** principles. Start by ensuring smaller screens (e.g., 320–640px) are well-optimized, then scale up for larger breakpoints.  
   - Use **flexible grids** or utility classes (Tailwind or DaisyUI) for layout.  
   - Check all user flows (ticket submission, agent queue viewing, admin dashboards) at key breakpoints (e.g., 640px, 768px, 1024px, 1280px).

3. **Accessibility**  
   - Ensure **keyboard navigability**: All forms, buttons, and links can be accessed and clicked without a mouse.  
   - Comply with **WCAG 2.1** guidelines: Provide sufficient color contrast, descriptive alt-text for images, and ARIA labels when needed.  
   - Keep dynamic content (like AI-suggested replies) clearly labeled for screen readers.

4. **Focus on Core Actions**  
   - Each step in the user flow should emphasize the primary task:  
     - **Customer**: Submitting or updating a ticket.  
     - **Agent**: Reviewing or resolving tickets.  
     - **Admin**: Configuring rules, viewing metrics.  
   - Secondary actions (like leaving an internal note, attaching a file) are visible but not distracting.

---

## **2. Interaction Guidelines**

1. **Forms & Validation**  
   - Use short, clear labels.  
   - Provide inline validation or minimal error messages (e.g., “Please fill out the subject field”) for incorrect inputs.  
   - On success, offer a clear confirmation (e.g., “Your ticket has been created”).

2. **Navigation**  
   - Keep a **simple, top-level** navigation bar: “Tickets,” “Knowledge Base,” “Analytics,” “Settings.”  
   - For multi-step processes (like creating a new team or adding a custom field), rely on progressive disclosure—only show relevant fields at each step.

3. **Feedback & State Changes**  
   - Show **loading indicators** (spinners or minimal progress bars) for data fetches.  
   - Use **toast notifications** or small pop-ups for immediate user feedback (e.g., “Ticket escalated!”).  
   - Real-time updates (like priority changes or new chat messages) highlight with subtle animations (fade or slide in).

4. **AI Interactions**  
   - Clearly label AI-generated responses (e.g., “AI Suggestion”).  
   - Provide an easily visible “Edit” or “Approve” button for agents to accept or modify the AI suggestion.  
   - Keep the AI suggestions visually distinct but integrated with the ticket UI (don’t overshadow agent or user content).

---

## **3. Tech Stack Considerations**

1. **Next.js (App Router)**  
   - Structure routes to match user flows: e.g., `app/tickets/`, `app/knowledge-base/`.  
   - Implement server components for data-heavy pages (e.g., ticket lists) to leverage Supabase SSR.  
   - Maintain consistent file/folder naming to avoid confusion with code-based approach in `tech-stack-rules.md`.

2. **Supabase**  
   - Use RLS (Row Level Security) to ensure only authorized users (customers, agents, or admins) can view or modify relevant pages/components.  
   - For dynamic content (AI suggestions, real-time updates), rely on **Supabase Realtime** or subscriptions to keep the UI fresh.

3. **Tailwind / DaisyUI**  
   - Keep utility classes minimal and purposeful: e.g., `p-4`, `flex`, `items-center`.  
   - For component styling, rely on DaisyUI’s minimal variants or create custom ones in line with the **minimalist** theme guidelines.  
   - Let “white space + few accent colors” do the heavy lifting for the aesthetic.

4. **Performance & Caching**  
   - Use `TanStack Query` for client-side data. Keep queries small, with short re-fetch intervals for real-time ticket updates.  
   - Cache or pre-fetch key data (e.g., ticket statuses, user profiles) to reduce load times.

---

## **4. Component-Level Standards**

1. **Naming & Organization**  
   - Store each UI component in a dedicated directory (e.g., `components/`).  
   - Group reusable components under `ui/` or `common/` to promote consistency (e.g., `ui/Button.tsx`, `common/Modal.tsx`).  
   - Follow PascalCase for React components (e.g., `TicketForm.tsx`, `AgentQueue.tsx`).

2. **Documentation & Props**  
   - Use TypeScript interfaces to clearly define component props.  
   - For complex logic (AI responses, dynamic queries), add short docstrings or comments referencing `user-flow.md` or `tech-stack-rules.md` for context.

3. **Accessibility Testing**  
   - Use a11y checkers (e.g., [axe](https://www.deque.com/axe/)) on critical UI flows.  
   - Provide label text or ARIA labels on every interactive element.

---

## **5. Future Enhancements**

- Integrate advanced **AI-driven** design elements (e.g., auto-suggested UI layouts) only if they don’t compromise minimalism.  
- Add theming or color customization for enterprise users (still under a minimalist approach).  
- Expand **internationalization**: Keep language toggles discreet, preserving the minimal layout.

---

## **Summary**

- **Minimal** design with an emphasis on clarity and usability.  
- **Responsive** breakpoints and a focus on **accessibility**.  
- Tie the front-end seamlessly to **Supabase** for real-time data and AI-driven features.  
- Keep code structure and naming consistent with the guidelines from `@tech-stack.md` and `@tech-stack-rules.md`.  

By following these **UI rules**, **Customerly** will provide a user-friendly, responsive, and visually consistent platform, ensuring all roles (customers, agents, admins) can efficiently navigate ticket creation, AI interactions, and advanced configurations.

