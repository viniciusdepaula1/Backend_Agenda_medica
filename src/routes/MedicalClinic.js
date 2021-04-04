// imports
const express = require('express');
const router = express.Router();
const auth = require('./middlewares/auth');

// cada controller define as funções que serão executadas em cada endpoint. 
const MedicalClinic = require('../controllers/MedicalClinic');

router.post('/create', auth.createMiddlewareClaims, MedicalClinic.create);
router.post('/addDoctor', auth.clinicClaimsMiddleware, MedicalClinic.addDoctor);
router.delete('/delete', auth.clinicClaimsMiddleware,  MedicalClinic.delete);

module.exports = router;