const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({

    description: {
        type: String,
        requird: true,
        max: 255
    },
    ownerid: {
        type: String,
        required: true
    },
    ownername: {
        type: String,
        required: true
    },
    imageName: {
        type: String,
        required: false
    },
    imageData:{
        type: String,
        required: false
    }
    
});

module.exports = mongoose.model('Posts', postSchema);