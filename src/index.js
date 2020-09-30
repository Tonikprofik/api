// index.js
// This is the main entry point of our application

require('dotenv').config();
const express = require('express');
const {ApolloServer, gql} = require('apollo-server-express');

const db = require('./db');
const models = require('./models');


// run server on port in .env or port 4k
const port = process.env.PORT || 4000;
//store db_host value as variable
const DB_HOST = process.env.DB_HOST;

    
//construct schema, using GraphQL
const typeDefs = gql`
type Query {
    hellnoo:String!
    notes: [Note!]!
    note(id: ID!): Note!
},
type Note {
    id: ID!
    content: String!
    author: String!
},
type Mutation {
    newNote(content: String!): Note!
}`;

//provide resolver functions for our schema fields
const resolvers = {
    Query:{
        hellnoo: () => 'Hell noo worlddd !',
        notes: async () => {
            return await models.Note.find();
        },
        note: async (parent, args) => {
            return await models.Note.findById(args.id);
        }
    },
    Mutation: {
        newNote: async (parent,args) => {
            return await models.Note.create({
                content: args.content,
                author: 'Tonik Profik'
            });
            
        }
    }
};


const app = express();

//connect to database
db.connect(DB_HOST);

// Apollo server setup
const server = new ApolloServer ({ typeDefs, resolvers});

// apply the Apollo GraphQl middleware and set path to /api
server.applyMiddleware({ app, path: '/api'});

app.get('/', (req,res) => res.send('Hello world !!!'));

app.listen({port}, () => 
  console.log(`GrapghQL runnin on port http://localhost:${port}${server.graphqlPath}`)
);

