import { ApolloClient, InMemoryCache } from "@apollo/client";

console.log(`connecting to subgraph endpoint ${process.env.REACT_APP_PIXELBOARD_SUBGRAPH}`)
export const pixelBoardSubgraphClient = new ApolloClient({
  uri: process.env.REACT_APP_PIXELBOARD_SUBGRAPH,
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          bricks: {
            keyArgs: ['wall.id'],
            merge(existing, incoming) {
              console.log(`MERGE 1 -- ${Array.isArray(existing)} -- ${Array.isArray(incoming)}`)
              return existing ? [
                ...existing,
                ...incoming,
              ] : incoming;
              /** 
              if (!incoming) return existing
              if (!existing) return incoming
              console.log(`MERGING BRICKS -- ${Array.isArray(existing)} -- ${Array.isArray(incoming)}`)
              let brickTracker: any = {}
              if (existing && existing.bricks) {
                console.log(`MERGING existing length ${existing.bricks.length}  -- ${existing.bricks[0]}`)

                brickTracker = existing.bricks.reduce((acc: any, b: any) => acc[b.id] = b && acc,  {})
              }
              if (incoming && incoming) {
                console.log(`MERGING incoming length ${incoming.length} -- ${incoming[0].id}`)
                const incomingTracked = incoming.reduce((acc: any, b: any) => acc[b.id] = b && acc,  {})
                brickTracker = {...brickTracker, ...incomingTracked};
              }
              let bricks = Object.values(brickTracker)
              console.log(`MERGED ${bricks.length}`)

              return {
                ...incoming,
                bricks,
              };
              */
            }
          }
        }
      }
    }
  }),
});