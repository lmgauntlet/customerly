import { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@customerly/db'

declare global {
  interface Window {
    supabase: SupabaseClient<Database>
  }
  
  namespace Cypress {
    interface AUTWindow {
      supabase: SupabaseClient<Database>
    }
  }
}
