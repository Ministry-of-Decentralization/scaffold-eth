import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";
import fetch from "cross-fetch"




console.log(`subgraph endpoint ${process.env.PIXELBOARD_SUBGRAPH}`)
export const subgraphClient = new ApolloClient({
  link: new HttpLink({
    uri: process.env.PIXELBOARD_SUBGRAPH,
    fetch
  }),
  cache: new InMemoryCache()
});


