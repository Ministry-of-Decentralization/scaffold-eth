import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";
import fetch from "cross-fetch"




console.log(`subgraph endpoint `, process.env.PIXELBOARD_SUBGRAPH)
export const subgraphClient = new ApolloClient({
  link: new HttpLink({
    uri: process.env.PIXELBOARD_SUBGRAPH,
    fetch
  }),//"http://docker_graph-node_1:8000/subgraphs/name/scaffold-eth/your-contract",//process.env.LITHIUM_SUBGRAPH_URI,
  cache: new InMemoryCache()
});


