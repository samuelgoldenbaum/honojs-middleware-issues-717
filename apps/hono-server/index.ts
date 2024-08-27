import { initTRPC } from '@trpc/server'
import { cors } from 'hono/cors'
import { z } from 'zod'
import { EventEmitter, on } from 'events'
import { randomUUID } from 'crypto'
import superjson from 'superjson'
import { Hono } from 'hono'
import { EVENT, Widget } from '../common'
import { trpcServer } from '@hono/trpc-server'

const t = initTRPC.create({
  transformer: superjson
})
const eventEmitter = new EventEmitter()

const publicProcedure = t.procedure
const router = t.router

const appRouter = router({
  create: publicProcedure
    .input(
      z.object({
        name: z.string()
      })
    )
    .mutation(({ input }) => {
      const widget: Widget = {
        ...input,
        id: randomUUID(),
        createdAt: new Date().toDateString()
      } satisfies Widget

      eventEmitter.emit(EVENT.CREATE, widget)
    }),
  onCreate: publicProcedure.subscription(async function* (opts) {
    for await (const [data] of on(eventEmitter, EVENT.CREATE)) {
      const widget = data as Widget
      yield widget
    }
  })
})

export type AppRouter = typeof appRouter

const app = new Hono().use(cors()).use(
  '/trpc/*',
  trpcServer({
    router: appRouter
  })
)

export default {
  port: 3001,
  fetch: app.fetch
}
