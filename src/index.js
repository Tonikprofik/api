// index.js
// This is the main entry point of our application

require('dotenv').config();
const express = require('express');
const {ApolloServer} = require('apollo-server-express');

//local module imports
const db = require('./db');
const models = require('./models');
//construct schema, using GraphQL
const typeDefs = require('./schema');
//provide resolver functions for our schema fields
const resolvers = require('./resolvers');


// run server on port in .env or port 4k
const port = process.env.PORT || 4000;
//store db_host value as variable
const DB_HOST = process.env.DB_HOST;


const app = express();

//connect to database
db.connect(DB_HOST);

// Apollo server setup
const server = new ApolloServer ({ 
    typeDefs, resolvers,
    context: () =>{
        // add the db models to context
        return {models};
    }});

// apply the Apollo GraphQl middleware and set path to /api
server.applyMiddleware({ app, path: '/api'});

app.get('/', (req,res) => res.send('Hello world !!!'));

app.listen({port}, () => 
  console.log(`GrapghQL runnin on port http://localhost:${port}${server.graphqlPath}`)
);

