# phase-4.md

# **Phase 4: AI Baseline Integration**

In this phase, we incorporate **baseline AI features**, such as LLM-generated responses, retrieval-augmented generation (RAG) for the knowledge base, and basic automation. Reference **@user-flow.md** for AI-driven user stories and use **@tech-stack-rules.md** for best practices around Supabase Edge Functions.

---

## **Relevant User Stories**
- **(5)** AI-Powered Chatbot Assistance
- **(9)** Use AI-Suggested Responses (fully realized here)
- **(16)** Configure AI & RAG Settings
- **(20)** SaaS Integration Hooks (partial, for AI routing)
- **(21)** Automatic Ticket Creation from In-App Errors (optional partial here)

---

## **Feature Goals**
1. **LLM-Generated Replies**: Generate draft responses for tickets.  
2. **RAG-based Knowledge Retrieval**: Use the KB articles as context to improve AI suggestions.  
3. **Human-in-the-Loop**: Agents can edit or approve AI suggestions, then send to customer.  
4. **Basic Chatbot**: On the customer portal, a chatbot that answers common questions or escalates.

---

## **Checklist of Tasks**

### **A. Frontend**

1. **AI Suggestion Panel Completion**  
   - [ ] Replace placeholder code from Phase 2 with real LLM-generated responses.  
   - [ ] Display AI’s reply in a distinct card, with an “Edit” / “Approve & Send” button.

2. **Customer Chatbot**  
   - [ ] Add a chat widget that interacts with the AI.  
   - [ ] If the AI can’t solve an issue, auto-create or escalate a ticket.

3. **AI Settings UI**  
   - [ ] Provide an admin page for “AI & RAG Settings” referencing **phase-3** admin structure.  
   - [ ] Let admins enable/disable knowledge sources or toggle the chatbot.

### **B. Backend**

1. **LLM Endpoint Integration**  
   - [ ] Create a Supabase Edge Function that calls an LLM provider (OpenAI, etc.) with the user’s query or ticket context.  
   - [ ] Return the generated draft reply to the agent interface.

2. **RAG Implementation**  
   - [ ] Set up an approach to retrieve relevant KB articles (semantic search, embeddings in Supabase, etc.).  
   - [ ] Pass the top relevant articles to the LLM for context.

3. **Human-in-the-Loop Mechanisms**  
   - [ ] Add a “requires_approval” or “hitl_required” flag for tickets if the AI sees certain triggers (e.g., enterprise SLA).  
   - [ ] Edge function to notify agent(s) or queue if manual oversight is needed.

4. **Chatbot Logic**  
   - [ ] A server component or edge function that takes a customer’s query, queries the LLM + KB, and returns an answer.  
   - [ ] If the query can’t be answered, auto-generate a ticket creation event.

5. **Testing & Docs**  
   - [ ] Verify AI suggestions in real scenarios (like knowledge base references).  
   - [ ] Document LLM endpoints, environment variable usage, and fallback strategies.

---