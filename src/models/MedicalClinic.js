const mongoose = require('mongoose');

const MedicalClinicSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    cnpj: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    DoctorsList: {
        type: [String],
        required: false
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

module.exports = mongoose.model('MedicalClinic', MedicalClinicSchema);
