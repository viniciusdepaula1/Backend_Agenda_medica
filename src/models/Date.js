const mongoose = require('mongoose');

const DateSchema = new mongoose.Schema({
    Comments: {
        type: String,
        required: true,
    },
    Date: {
        type: Date,
        required: true,
    },
    UsuarioUID: {
        type: String,
        required: true
    }
});

module.exports = DateSchema
