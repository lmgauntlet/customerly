describe('Ticket Messaging', () => {
  const TEST_USER = {
    email: 'test@example.com',
    password: 'password123'
  }

  const TEST_TICKET_ID = 'test-ticket-123'

  beforeEach(() => {
    cy.login(TEST_USER.email, TEST_USER.password)
    cy.mockTicket(TEST_TICKET_ID)
    cy.visit(`/tickets/${TEST_TICKET_ID}`)
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

    // Verify the message appears in the thread
    cy.contains(replyText).should('be.visible')
    cy.get('textarea').should('have.value', '') // Input should be cleared
  })

  it('should send an internal note', () => {
    const noteText = 'This is an internal note'

    // Switch to internal note mode
    cy.get('button').contains('Internal Note').click()

    // Type and send an internal note
    cy.get('textarea').type(noteText)
    cy.get('button').contains('Add Note').click()

    // Verify the note appears in the thread with internal styling
    cy.contains(noteText)
      .parents('.flex')
      .should('have.class', 'bg-[#FFF9E7]')
      .and('have.class', 'rounded-lg')
    cy.get('textarea').should('have.value', '') // Input should be cleared
  })

  it('should receive real-time message updates', () => {
    // Mock a new message coming in through the Supabase subscription
    const newMessage = {
      id: 'new-message-123',
      content: 'New message from another user',
      sender: {
        name: 'Another User',
        email: 'another@example.com'
      },
      created_at: new Date().toISOString(),
      is_internal: false
    }

    // Trigger the Supabase subscription callback
    cy.window().then((win) => {
      // @ts-ignore - Access the Supabase client
      win.supabase.getSubscription('messages:test-ticket-123').subscription.callbacks[0]({
        new: newMessage
      })
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
