import { setupWorker } from 'msw/browser'
import { handlers } from './handlers'

// This configures a Service Worker with the given request handlers.
export const worker = setupWorker(...handlers)

// worker的启动由main.ts控制，这里不直接启动
// worker.start({
//   onUnhandledRequest: 'bypass'
// });