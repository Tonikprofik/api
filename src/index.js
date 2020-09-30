// index.js
// This is the main entry point of our application

require('dotenv').config();
const db = require('./db');
const express = require('express');
const {ApolloServer, gql} = require('apollo-server-express');
const models = require('./models');


// run server on port in .env or port 4k
const port = process.env.PORT || 4000;
//store db_host value as variable
const DB_HOST = process.env.DB_HOST;


let notes = [
    {id: '1', content: 'This note', author: 'Tony'},
    {id: '2', content: 'This is a note', author: 'Anna'},
    {id: '3', content: 'This another note', author: 'Lebowski'}];

    
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
        note: (parent, args) => {
            return notes.find(note => note.id ===args.id);
        }
    },
    Mutation: {
        newNote: (parent,args) => {
            let noteValue = {
                id: String(notes.length +1),
                content: args.content,
                author: 'Tonik Profik'
            };
            notes.push(noteValue);
            return noteValue;
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

