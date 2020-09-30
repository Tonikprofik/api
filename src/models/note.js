//requi mongoose library
const mongoose = require('mongoose');
// define notes db schema
const noteSchema = new mongoose.Schema(
    {
        content: {
        type: String,
        required: true
        },
        author: {
            type: String,
            required:true
        }
    },
    {
        // assign createdAt and updateAt fields with a Date type
        timestamps: true
    }
);
// define Note model with the schema
const Note = mongoose.model('Note', noteSchema);
//export module
module.exports = Note;