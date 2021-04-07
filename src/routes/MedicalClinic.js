// imports
const express = require('express');
const router = express.Router();
const auth = require('./middlewares/auth');

// cada controller define as funções que serão executadas em cada endpoint. 
const MedicalClinic = require('../controllers/MedicalClinic');

router.get('/returnDoctors', auth.clinicClaimsMiddleware, MedicalClinic.returnAll);
router.get('/seachClinic', auth.userClaimsMiddleware, MedicalClinic.search)

router.post('/create', auth.createMiddlewareClaims, MedicalClinic.create);
router.post('/addDoctor', auth.clinicClaimsMiddleware, MedicalClinic.addDoctor);
router.post('/deleteDoctor', auth.clinicClaimsMiddleware, MedicalClinic.deleteDoctorOfList)

router.delete('/delete', auth.clinicClaimsMiddleware,  MedicalClinic.delete);

module.exports = router;