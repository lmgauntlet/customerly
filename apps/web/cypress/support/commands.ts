/// <reference types="cypress" />
import '@testing-library/cypress/add-commands'
import { createClient, SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@customerly/db'

declare global {
  namespace Cypress {
    interface Chainable {
      login(email: string, password: string): Chainable<void>
      supabase(): Chainable<SupabaseClient<Database>>
      resetTestData(): Chainable<void>
      verifySeededData(): Chainable<void>
    }
  }
}

// Initialize Supabase client
Cypress.Commands.add('supabase', () => {
  const supabase = createClient<Database>(
    Cypress.env('NEXT_PUBLIC_SUPABASE_URL'),
    Cypress.env('NEXT_PUBLIC_SUPABASE_ANON_KEY')
  )
  return cy.wrap(supabase)
})

// Login command
Cypress.Commands.add('login', (email: string, password: string) => {
  cy.supabase().then(async (supabase) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) throw error
  })
})

// Reset test data
Cypress.Commands.add('resetTestData', () => {
  cy.supabase().then(async (supabase) => {
    const tables = ['tickets', 'ticket_messages', 'teams', 'team_members']
    for (const table of tables) {
      const { error } = await supabase
        .from(table)
        .delete()
        .eq('is_test_data', true)
      
      if (error) throw error
    }
  })
})

// Verify seeded data exists
Cypress.Commands.add('verifySeededData', () => {
  cy.supabase().then(async (supabase) => {
    // Verify test user exists
    const { data: testUser, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('email', Cypress.env('TEST_USER_EMAIL'))
      .single()

    if (userError || !testUser) {
      throw new Error(`Test user ${Cypress.env('TEST_USER_EMAIL')} not found`)
    }

    // Verify required data exists
    const { data: teams, error: teamsError } = await supabase
      .from('teams')
      .select('*')
      .limit(1)

    if (teamsError || !teams.length) {
      throw new Error('No teams found in database')
    }
  })
})

export {}
