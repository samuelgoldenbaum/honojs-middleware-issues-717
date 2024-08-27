import { initTRPC } from '@trpc/server'
import { createHTTPServer } from '@trpc/server/adapters/standalone'
import cors from 'cors'
import { z } from 'zod'
import { EventEmitter, on } from 'events'
import { randomUUID } from 'crypto'
import superjson from 'superjson'
import { EVENT, Widget } from '../common'

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
      const post = data as Widget
      yield post
    }
  })
})

export type AppRouter = typeof appRouter

// create server
createHTTPServer({
  middleware: cors(),
  router: appRouter
}).listen(3000)
