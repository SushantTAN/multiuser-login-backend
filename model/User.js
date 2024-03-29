const mongoose = require('mongoose');
const { string } = require('@hapi/joi');





const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        min: 6,
        max: 255
    },
    email: {
        type: String,
        required: true,
        max: 255,
        min: 6
    },
    password: {
        type: String,
        required: true,
        min: 6,
        max: 1024
    },
    followers: [{
        type: String,
        required: false
    }],
    following: [{
        type: String,
        required: false
    }],
    Date: {
        type: Date,
        default: Date.now
    }
    

});

module.exports = mongoose.model('User', userSchema);
