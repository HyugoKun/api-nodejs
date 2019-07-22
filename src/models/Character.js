const mongoose = require('mongoose');

const characterSchema = mongoose.Schema({
    
    name: {
        type: String,
        require: true
    },
    race: {
        type: String,
        require: true
    },
    class: {
        type: String,
        require: true
    },
    level: {
        type: Number,
        require: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        require: true
    }
});

mongoose.model('Character', characterSchema);