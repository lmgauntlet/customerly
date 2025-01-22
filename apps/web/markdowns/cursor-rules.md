Thoroughly review the db/prisma/schema.prisma file and the prisma/migrations/XXX_initial_schema migration. These define the Supabase tables and the relevant Supabase API calls. Ensure that any Supabase API endpoints you invoke align with the model structure as defined in your Prisma schema.

Always use supabase ServerClient for accessing the data. Please example below:
```tsx
import { createServerClient } from '@/utils/supabase'
import { cookies } from 'next/headers'

export default async function Page() {
    const cookieStore = cookies()
    const supabase = createServerClient(cookieStore)
    const { data: notes } = await supabase.from('notes').select()

    return <pre>{JSON.stringify(notes, null, 2)}</pre>
}
```

Use the phaseX.md documents for guidance:
	•	Complete phases sequentially (Phase 1 → Phase 5), though overlapping tasks is permissible if it streamlines development.
	•	Each file (e.g., phase-1.md, phase-2.md) outlines a feature set. When you finish a phase, confirm that all tasks are completed and tested before advancing to the next.

Throughout development, always reference:
	•	@technical-stack-rules.md
	•	@user-flow.md
	•	@tech-stack-rules.md
	•	@ui-rules.md
	•	@theme-rules.md
	•	@codebase-best-practices.md
