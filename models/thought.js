let mongoose = require('mongoose');

// Thought Schema
let thoughtSchema = mongoose.Schema({
    title:{
        type: String,
        required:true
    },
    author:{
        type: String,
        required:true
    },
    body:{
        type: String,
        required:true
    }
});

let Thought = module.exports = mongoose.model('Thought', thoughtSchema);