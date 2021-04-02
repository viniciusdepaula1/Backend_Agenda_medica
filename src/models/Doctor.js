const mongoose = require('mongoose');

const DoctorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    cpf: {
        type: String,
        required: true
    },
    crm: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    specialities: {
        type: [String],
        required: false
    },
    age: {
        type: Number,
        required: true
    },
    created: {
        type: Date,
        default: Date.now,
    },
    firebaseUID: {
        type: String,
        required: true
    },
    schedule: {
        type: [Date],
        required: false
    }
});

module.exports = mongoose.model('Doctor', DoctorSchema);
