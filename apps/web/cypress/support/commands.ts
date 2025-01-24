/// <reference types="cypress" />

import '@testing-library/cypress/add-commands'

declare global {
  namespace Cypress {
    interface Chainable {
      login(email: string, password: string): Chainable<void>
      mockTicket(ticketId: string): Chainable<void>
      mockSupabase(): Chainable<void>
    }
  }
}

// Mock Supabase authentication and real-time subscriptions
Cypress.Commands.add('mockSupabase', () => {
  cy.intercept('POST', '/api/auth/callback', {
    statusCode: 200,
    body: {
      user: {
        id: 'test-user-id',
        email: 'test@example.com',
        name: 'Test User',
        avatarUrl: null
      },
      session: {
        access_token: 'test-token'
      }
    }
  }).as('authCallback')

  // Mock Supabase real-time subscription
  cy.window().then((win) => {
    const mockSubscription = {
      unsubscribe: cy.stub().as('unsubscribe')
    }
    cy.stub(win.supabase, 'channel').returns({
      on: () => mockSubscription,
      subscribe: () => mockSubscription
    })
  })
})

// Login command
Cypress.Commands.add('login', (email: string, password: string) => {
  cy.session([email, password], () => {
    cy.mockSupabase()
    cy.visit('/login')
    cy.get('input[name="email"]').type(email)
    cy.get('input[name="password"]').type(password)
    cy.get('button[type="submit"]').click()
    cy.url().should('not.include', '/login')
  })
})

// Mock ticket data command
Cypress.Commands.add('mockTicket', (ticketId: string) => {
  cy.intercept('GET', `/api/tickets/${ticketId}`, {
    statusCode: 200,
    body: {
      id: ticketId,
      title: 'Test Ticket',
      description: 'Test Description',
      status: 'open',
      priority: 'medium',
      customer: {
        id: 'customer-1',
        name: 'Test Customer',
        email: 'customer@example.com',
        avatarUrl: null
      },
      messages: [],
      created_at: new Date().toISOString(),
      assignedAgent: {
        user: {
          id: 'test-user-id',
          name: 'Test Agent',
          email: 'agent@example.com',
          avatarUrl: null
        }
      }
    }
  }).as('getTicket')
})

export {}
