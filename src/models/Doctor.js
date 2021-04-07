const mongoose = require('mongoose');
const DateType = require('./Date');

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
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    created: {
        type: Date,
        default: Date.now,
    },
    schedule: {
        type: [DateType],
        required: false
    }
});

module.exports = mongoose.model('Doctor', DoctorSchema);
