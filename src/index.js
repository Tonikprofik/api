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

const jwt = require('jsonwebtoken');
// get the user info from a JWT
const getUser = token => {
  if (token) {
    try {
      // return the user info from token
      return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      throw new Error('Sesson not valiiid');
    }
  }
}

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
    context: ({req}) =>{
      //get the user token from the headers
      const token = req.headers.authorization;
      //try retrieving user with token
      const user = getUser(token);
      //temporarily, log user in console
      console.log(user);
      // add the db models to context
      return {models,user};
    }});

// apply the Apollo GraphQl middleware and set path to /api
server.applyMiddleware({ app, path: '/api'});


app.listen({port}, () => 
  console.log(`GrapghQL runnin on port http://localhost:${port}${server.graphqlPath}`
  )
);

