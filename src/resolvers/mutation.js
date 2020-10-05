const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const {
    AuthenticationError,
    ForbiddenError
} = require('apollo-server-express');
require('dotenv').config();

const gravatar = require('../util/gravatar');
const { model } = require('../models/user');
const { use } = require('passport');
const Note = require('../models/note');


module.exports = {
    newNote: async (parent,args, {models, user}) => {
        if (!user) {
            throw new AuthenticationError('Must signed in you must be')
        }

        return await models.Note.create({
            content: args.content,
            author: mongoose.Types.ObjectId(user.id)
        });
    },
    deleteNote: async (parent, id, {models, user}) => {
        //if not a user, throw auth err
        if (!user) {
            throw AuthenticationError('Must signed in you must be to delete');
        }
        // if note owner and current user dont match, forbidden err
        const note = await models.Note.findById(id);
        if (note && String(note.author) !== user.id) {
            throw new ForbiddenError("No permissions you have to delete the note");
        }

        try {
            await models.Note.findOneAndRemove({_id: id});
            return true;
        } catch (err) {
            return false;
        }
    },
    updateNote: async (parent, {content, id}, {models, user}) => {
        // if not a user, throw authentication err
        if (!user) {
            throw AuthenticationError('signed in you must be to update a note');
        }
        
        const note = await models.Note.findById(id);
        //if note owner and current user dont motch, throw forbidden err
        if (note && String(note.author) !==user.id) {
            throw ForbiddenError('no permissions to update note');
        }
        //update the note in db and return updated note
        return await models.Note.findOneAndUpdate(
                {
                    _id: id,
                },
                {
                    $set: {
                        content
                    }
                },
                {
                    new: true
                });
        
    },
    signUp: async (parent, {username, email, password}, {models}) => {
        //normalize email
        email = email.trim().toLowerCase();
        //hashin password
        const hashed = await bcrypt.hash(password,10);
        //create the gravatar url
        const avatar = gravatar(email);
        try {
            const user = await models.User.create({
                username, email, avatar, password:hashed
            }); // create and return json web token
            return jwt.sign({id: user._id}, process.env.JWT_SECRET);

        } catch (error) {
            console.log(error);
            throw new Error('er creating account');            
        }
    },
    signIn: async (parent, { username,email, password}, {models}) => {
        if (email) {
            //normalize email
            email = email.trim().toLowerCase();
        }
        
        const user = await models.User.findOne({
            $or: [{email}, {username}]
        });
        // if user not found, throw auth err
        if (!user) {
            throw new AuthenticationError('Err signin in');
        }
        // if password doesnt match, throw auth err
        const valid = await bcrypt.compare(password, user.password);
        if (!valid) {
            throw new AuthenticationError('err signing in');
        }
        // create then return json web token
        return jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    },
    toggleFavorite: async (parent, {id}, {models, user}) => {
        //if no user context is passed, throw auth err
        if (!user) {
            throw new AuthenticationError();
        }
        //check to see if user had already favorited the note
        let noteCheck = await models.Note.findById(id);
        const hasUser = noteCheck.favoritedBy.indexOf(user.id);
        // if the user exists in list
        //pull him from the list and reduce the count by 1
        if (hasUser >= 0) {
            return await models.Note.findByIdAndUpdate (
                id,
                {
                    $pull: {
                        favoritedBy: mongoose.Types.ObjectId(user.id)
                    },
                    $inc: {
                        favoriteCount: -1
                    }
                },//set new to true to return the updated doc
                {new: true}
            );
        } 
        else {
            //if the user doesnt exit in the list
            //add them to the list and icrement the count by 1
            return await models.Note.findByIdAndUpdate(
                id,
                {
                    $push: {
                        favoritedBy: mongoose.Types.ObjectId(user.id)
                    },
                    $inc: {
                        favoriteCount: 1
                    }
                },
                { new: true}
            );
        }
    }

};