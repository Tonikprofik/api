// index.js
// This is the main entry point of our application

const express = require('express');
const {ApolloServer, gql} = require('apollo-server-express');


// run server on port in .env or port 4k
const port = process.env.PORT || 4000;

//construct schema, using GraphQL
const typeDefs = gql`
type Query {
    hellnoo:String
}`;

//provide resolver functions for our schema fields
const resolvers = {
    Query:{
        hellnoo: () => 'Hell noo worlddd !'
    }
};

const app = express();

// Apollo server setup
const server = new ApolloServer ({ typeDefs, resolvers});

// apply the Apollo GraphQl middleware and set path to /api
server.applyMiddleware({ app, path: '/api'});

app.get('/', (req,res) => res.send('Hello world !!!'));

app.listen({port}, () => 
  console.log(`GrapghQL runnin on port http://localhost:${port}${server.graphqlPath}`)
);

