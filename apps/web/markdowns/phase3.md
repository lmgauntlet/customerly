# phase-3.md

# **Phase 3: Admin & Team Management**

This phase implements administrative capabilities like custom ticket fields, team permissions, and routing rules. See **@user-flow.md** for admin user stories, and keep the **AI-first** code organization from `@codebase-best-practices.md`.

---

## **Relevant User Stories**
- **(12)** Configure Ticket Fields & Metadata
- **(13)** Manage Teams & Permissions
- **(14)** Set Routing Rules & Automation
- **(15)** Manage Knowledge Base Content

---

## **Feature Goals**
1. **Custom Fields**: Admin can define new fields (e.g., “module type,” “version number”).  
2. **Team Management**: Admin can create teams, assign agents, and set permissions.  
3. **Routing Rules**: Basic automation (if “Billing Issue,” route to “Billing Team”).  
4. **Knowledge Base**: Admin can create categories/articles for self-service.

---

## **Checklist of Tasks**

### **A. Frontend**

1. **Admin Dashboard**  
   - [ ] Create `app/admin/` directory with sub-pages for “Fields & Metadata,” “Teams,” “Routing Rules,” and “Knowledge Base.”  
   - [ ] Use minimal top-level navigation to switch between these sections.

2. **Custom Fields Management**  
   - [ ] Provide a form for creating or editing custom fields (field name, type, optional/required).  
   - [ ] Update the UI in ticket creation flows to reflect new fields.

3. **Teams & Permissions**  
   - [ ] A page to add new teams and assign existing agents.  
   - [ ] Ability to set coverage times or special skill tags for each team.

4. **Routing Rules**  
   - [ ] UI for condition-action sets (e.g., “If Priority=High => route to Tier 2 Team”).  
   - [ ] Provide toggle to activate/deactivate rules.

5. **Knowledge Base Management**  
   - [ ] WYSIWYG editor for creating articles with text, images, or videos.  
   - [ ] Category management (create, rename, delete categories).  
   - [ ] Minimal search or filter for existing articles.

### **B. Backend**

1. **Custom Fields Schema**  
   - [ ] Create a `custom_fields` table and possibly a `ticket_custom_field_values` table to store user entries.  
   - [ ] Migrate existing tickets to accommodate new fields.

2. **Team & Permission Tables**  
   - [ ] Possibly a `teams` table (name, coverage_hours, manager_id).  
   - [ ] A `team_members` join table linking agent ID to a team.  
   - [ ] Update RLS so that tickets assigned to a team are accessible to its members.

3. **Routing Rules Logic**  
   - [ ] A `routing_rules` table with conditions (JSON) and actions (JSON).  
   - [ ] An edge function or server component that triggers on ticket creation/update to apply routing rules.

4. **Knowledge Base Schema**  
   - [ ] `kb_articles` table with fields: `id`, `title`, `content`, `category_id`, `status` (draft/published), etc.  
   - [ ] `kb_categories` for organizing articles.  
   - [ ] RLS ensuring only admins can create or edit.

5. **Testing & Docs**  
   - [ ] Validate that newly created custom fields appear in the ticket creation form.  
   - [ ] Test rule-based assignments to ensure correct routing.  
   - [ ] Document each new endpoint or function.

---