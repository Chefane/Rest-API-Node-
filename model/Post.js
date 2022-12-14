const mongoose = require('mongoose');

const PostSchema = mongoose.Schema({
    name:{
        type: String,
        required: true,
    },
    course:{
        type: String,
        required: true,
    },
    date:{
        type: Date,
        default: Date.now
    },
});

module.exports = mongoose.model('Posts', PostSchema);