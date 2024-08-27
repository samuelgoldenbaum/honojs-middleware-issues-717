import {
  createTRPCClient,
  httpBatchLink,
  loggerLink,
  splitLink,
  unstable_httpSubscriptionLink
} from '@trpc/client'
import { AppRouter } from './../../hono-server'
import superjson from 'superjson'

const url =
  process.env.REACT_APP_SERVER === 'hono'
    ? 'http://localhost:3001/trpc'
    : 'http://localhost:3000'

export const trpc = createTRPCClient<AppRouter>({
  links: [
    loggerLink(),
    splitLink({
      condition: (op) => op.type === 'subscription',
      true: unstable_httpSubscriptionLink({
        url,
        transformer: superjson
      }),
      false: httpBatchLink({
        url,
        transformer: superjson
      })
    })
  ]
})
