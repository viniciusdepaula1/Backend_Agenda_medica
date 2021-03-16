const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    cpf: {
        type: String,
        required: true,
    },
    age: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    created: {
        type: Date,
        default: Date.now,
    },
    firebaseUID: {
        type: String,
        required: false
    },
});

module.exports = mongoose.model('User', UserSchema);
