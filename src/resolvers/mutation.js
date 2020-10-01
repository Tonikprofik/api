const { models } = require("mongoose")

module.exports = {
    newNote: async (parent,args, {models}) => {
        return await models.Note.create({
            content: args.content,
            author: 'Toniiik'
        });
    },
    deleteNote: async (parent, id, {models}) => {
        try {
            await models.Note.findOneAndRemove({_id: id})
        } catch (err) {
            return false;
        }
    }
}