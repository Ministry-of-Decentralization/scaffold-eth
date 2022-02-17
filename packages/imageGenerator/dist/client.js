"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.subgraphClient = void 0;
var client_1 = require("@apollo/client");
var cross_fetch_1 = __importDefault(require("cross-fetch"));
console.log("subgraph endpoint ".concat(process.env.PIXELBOARD_SUBGRAPH));
exports.subgraphClient = new client_1.ApolloClient({
    link: new client_1.HttpLink({
        uri: process.env.PIXELBOARD_SUBGRAPH,
        fetch: cross_fetch_1.default
    }),
    cache: new client_1.InMemoryCache()
});
