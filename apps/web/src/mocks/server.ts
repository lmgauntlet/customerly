import { http } from 'msw'
import { handlers } from './handlers'

// This configures a request mocking server with the given request handlers.
export const server = {
    listen: () => { },
    close: () => { },
    resetHandlers: () => { },
    use: (...handlers: any[]) => { },
    events: {
        on: () => { },
        removeListener: () => { },
        removeAllListeners: () => { }
    }
}
