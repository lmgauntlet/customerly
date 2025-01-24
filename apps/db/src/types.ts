export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      agents: {
        Row: {
          id: string
          user_id: string
          team_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          team_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          team_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      users: {
        Row: {
          id: string
          email: string
          name: string | null
          avatar_url: string | null
          role: 'admin' | 'agent' | 'customer'
          preferences: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          name?: string | null
          avatar_url?: string | null
          role?: 'admin' | 'agent' | 'customer'
          preferences?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string | null
          avatar_url?: string | null
          role?: 'admin' | 'agent' | 'customer'
          preferences?: Json
          created_at?: string
          updated_at?: string
        }
      }
      tickets: {
        Row: {
          id: string
          title: string
          description: string
          status: 'open' | 'in_progress' | 'closed'
          priority: 'low' | 'medium' | 'high'
          customer_id: string
          assigned_to: string | null
          team_id: string
          is_test_data: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          status?: 'open' | 'in_progress' | 'closed'
          priority?: 'low' | 'medium' | 'high'
          customer_id: string
          assigned_to?: string | null
          team_id: string
          is_test_data?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          status?: 'open' | 'in_progress' | 'closed'
          priority?: 'low' | 'medium' | 'high'
          customer_id?: string
          assigned_to?: string | null
          team_id?: string
          is_test_data?: boolean
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
