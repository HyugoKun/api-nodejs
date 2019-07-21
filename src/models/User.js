const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({

    username: {
        type: String,
        require: true
    },

    password: {
        type: String,
        require: true,
        select: false
    },

    isAdmin: {
        type: Boolean,
        default: false
    }
});

mongoose.model('User', userSchema);