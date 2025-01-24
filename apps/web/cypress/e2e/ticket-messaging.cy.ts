describe('Ticket Messaging', () => {
  const TEST_USER = {
    email: Cypress.env('TEST_USER_EMAIL'),
    password: Cypress.env('TEST_USER_PASSWORD')
  }

  let testTicketId: string

  beforeEach(() => {
    // Reset test data before each test
    cy.resetTestData()
    
    // Login with test user
    cy.login(TEST_USER.email, TEST_USER.password)
    
    // Create a test ticket in Supabase
    cy.supabase().then(async (supabase) => {
      const { data, error } = await supabase
        .from('tickets')
        .insert({
          title: 'Test Ticket',
          description: 'Test ticket for e2e testing',
          status: 'open',
          is_test_data: true,
          created_by: TEST_USER.email
        })
        .select()
        .single()
      
      if (error) throw error
      testTicketId = data.id
    })

    // Visit the ticket page
    cy.visit(`/tickets/${testTicketId}`)
  })

  afterEach(() => {
    // Clean up test data after each test
    cy.resetTestData()
  })

  it('should toggle between reply and internal note modes', () => {
    // Check initial state (reply mode)
    cy.get('button').contains('Reply').should('have.class', 'bg-primary')
    cy.get('button').contains('Internal Note').should('not.have.class', 'bg-primary')
    cy.get('textarea').should('have.attr', 'placeholder', 'Type your reply...')

    // Switch to internal note mode
    cy.get('button').contains('Internal Note').click()
    cy.get('button').contains('Internal Note').should('have.class', 'bg-primary')
    cy.get('button').contains('Reply').should('not.have.class', 'bg-primary')
    cy.get('textarea').should('have.attr', 'placeholder', 'Add an internal note...')

    // Switch back to reply mode
    cy.get('button').contains('Reply').click()
    cy.get('button').contains('Reply').should('have.class', 'bg-primary')
    cy.get('button').contains('Internal Note').should('not.have.class', 'bg-primary')
  })

  it('should send a reply message', () => {
    const replyText = 'This is a test reply'

    // Type and send a reply
    cy.get('textarea').type(replyText)
    cy.get('button').contains('Send Reply').click()

    // Verify the message appears in the thread and in the database
    cy.contains(replyText).should('be.visible')
    cy.get('textarea').should('have.value', '') // Input should be cleared

    // Verify in Supabase
    cy.supabase().then(async (supabase) => {
      const { data, error } = await supabase
        .from('ticket_messages')
        .select('*')
        .eq('ticket_id', testTicketId)
        .eq('message', replyText)
        .single()

      if (error) throw error
      expect(data.is_internal).to.be.false
      expect(data.created_by).to.equal(TEST_USER.email)
    })
  })

  it('should send an internal note', () => {
    const noteText = 'This is an internal note'

    // Switch to internal note mode
    cy.get('button').contains('Internal Note').click()

    // Type and send an internal note
    cy.get('textarea').type(noteText)
    cy.get('button').contains('Add Note').click()

    // Verify the note appears in the thread and in the database
    cy.contains(noteText).should('be.visible')
    cy.get('textarea').should('have.value', '') // Input should be cleared

    // Verify in Supabase
    cy.supabase().then(async (supabase) => {
      const { data, error } = await supabase
        .from('ticket_messages')
        .select('*')
        .eq('ticket_id', testTicketId)
        .eq('message', noteText)
        .single()

      if (error) throw error
      expect(data.is_internal).to.be.true
      expect(data.created_by).to.equal(TEST_USER.email)
    })
  })

  it('should receive real-time message updates', () => {
    // Create a new message in Supabase
    cy.supabase().then(async (supabase) => {
      const { data, error } = await supabase
        .from('ticket_messages')
        .insert({
          ticket_id: testTicketId,
          message: 'New message from another user',
          is_internal: false,
          created_by: 'another@example.com'
        })
        .select()
        .single()

      if (error) throw error
    })

    // Verify the new message appears without refreshing
    cy.contains('New message from another user').should('be.visible')
  })

  it('should handle message sending errors', () => {
    // Mock a failed message send
    cy.intercept('POST', '/api/messages', {
      statusCode: 500,
      body: { error: 'Failed to send message' }
    })

    // Try to send a message
    cy.get('textarea').type('This message should fail')
    cy.get('button').contains('Send Reply').click()

    // Verify error message appears
    cy.contains('Failed to send message').should('be.visible')
  })
})
