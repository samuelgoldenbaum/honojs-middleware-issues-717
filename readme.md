# Hono Middleware Error

1. clone
2. run `bun install`
3. run `bun start:hono` or `bun start:node` to switch between hono and node http servers

Issue [#717](https://github.com/honojs/middleware/issues/717#issuecomment-2311785867)

When using the Hono middleware as per
the [instructions](https://github.com/honojs/middleware/tree/main/packages/trpc-server),
and setting up a [tRPC subscription](https://trpc.io/docs/client/links/httpSubscriptionLink), the following error is
thrown in console and a loop is created that eventually leads to a
memory leak at the server:

```
net::ERR_INCOMPLETE_CHUNKED_ENCODING 200 (OK)
```

To reproduce, simply start the client and server by running `bun start:hono` and navigate to `http://localhost:8080` in
the browser. Open the developer console and you will see the error being logged.

The error does not occur when using the node http server instead of hono. To switch to the node server,
run `bun start:node` and navigate to `http://localhost:8080` in the browser. The error will not be thrown in this case.
