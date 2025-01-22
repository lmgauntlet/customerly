# phase-5.md

# **Phase 5: Advanced AI Features & Analytics**

This final phase refines AI workflows (HITL checks, advanced dashboards) and adds analytics for admin/team performance. This is where deeper RAG logic and summarization appear. Continue following **@user-flow.md** and referencing **@codebase-best-practices.md**.

---

## **Relevant User Stories**
- **(17)** View Team Performance & Metrics
- **(18)** Set Up Human-in-the-Loop (HITL) Checks
- **(22)** AI-Summarized Ticket Insights for Admins
- **(23)** Learning & Growth System for AI Models

---

## **Feature Goals**
1. **HITL Enhancement**: Fine-tune rules for when AI auto-resolves vs. requires agent sign-off.  
2. **AI Summaries**: Summarize ticket status, common issues, or trends for admins.  
3. **Analytics Dashboard**: Show real-time performance metrics (tickets resolved, average response time, etc.).  
4. **Learning & Growth**: Log AI mistakes or human corrections for iterative improvements.

---

## **Checklist of Tasks**

### **A. Frontend**

1. **Advanced HITL UI**  
   - [ ] Provide an admin toggle or rule-based approach to define “critical tickets” that must be manually approved.  
   - [ ] Show a dedicated “Human Review Queue” page for these high-priority tickets.

2. **AI Insights / Summaries**  
   - [ ] Add an “AI Insights” widget in the admin dashboard that displays top recurring issues or product modules causing tickets.  
   - [ ] Provide a “details” link to see a more in-depth breakdown (daily/weekly summary, trending tags).

3. **Analytics & Metrics**  
   - [ ] Create a performance dashboard (e.g., `app/admin/analytics/`) with charts for open vs. closed tickets, average resolution times, SLA compliance.  
   - [ ] Filter by date range, team, or agent.

### **B. Backend**

1. **HITL Rule Refinement**  
   - [ ] Extend the routing rules table or add a separate `hitl_rules` table to define triggers for mandatory human oversight.  
   - [ ] Adjust the AI logic to mark tickets that meet these triggers.

2. **AI Summarization**  
   - [ ] Implement a dedicated edge function to process daily/weekly ticket data.  
   - [ ] Possibly call an LLM to generate textual summaries, storing them in a `summaries` table.

3. **Analytics Infrastructure**  
   - [ ] Build or expand a `metrics` table to log ticket data over time.  
   - [ ] Provide aggregator queries or supabase Realtime hooks for dashboards.

4. **Learning & Growth**  
   - [ ] Store each instance where AI was overridden by an agent, capturing final resolution.  
   - [ ] Create a pipeline or additional function that updates the AI model’s knowledge store with these corrections.  
   - [ ] Possibly track success/failure rates for AI suggestions.

5. **Testing & Docs**  
   - [ ] Thoroughly test the new HITL flows and data summarization.  
   - [ ] Document the analytics endpoints, summarization approach, and how admins can interpret the AI insights.

---