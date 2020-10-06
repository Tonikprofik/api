//const { models } = require("mongoose");

module.exports = {
    notes: async (parent, args, {models}) => {
        return await models.Note.find().limit(100);
    },
    note: async (parent,args, {models}) => {
        return await models.Note.findById(args.id);
    },
    //find a user given their username
    user: async (parent, args, {models}) => { //(args, {username})
        return await models.User.findOne({ username: args.username }); //.findOne({ username })
    },
    users: async (parent, args, {models}) => {
        //find all users
        return await models.User.find({});
    },
    me: async (parent,args, {models, user}) => {
        //find a user given the current user signed
        return await models.User.findById(user.id);
    },
    noteFeed: async (parent, {cursor}, {models} ) => {
        //hardcored the limit
        const limit = 10;
        // default value false
        let hasNextPage = false;
        //if no cursor is passed, the default query will be empty
        //pull the newst notes from db
        let cursorQuery = {};

        //if theres cursor, query will look for notes with ObjectId less than that of the cursor
        if (cursor) {
            cursorQuery = {_id: { $lt:cursor }};
        }

        //find limit +1 of notes in our db, sort newest to oldest
        let notes = await models.Note.find(cursorQuery)
        .sort({ _id:1 })
        .limit(limit+1);

        //if the number of found notes exceed our limit
        //set hasNextPage true and trim the notes to the lim
        if (notes.length > limit) {
            hasNextPage = true;
            notes = notes.slice(0,-1);
        }

        // new cursor will be the Mongo Object Id of the last item in feed array
        const newCursor = notes [notes.length -1]._id;

        return {
            notes, cursor: newCursor, hasNextPage
        };
    }
};