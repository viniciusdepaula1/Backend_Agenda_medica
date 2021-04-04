// imports
const express = require('express');
const router = express.Router();
const auth = require('./middlewares/auth');

// cada controller define as funções que serão executadas em cada endpoint. 
const DoctorController = require('../controllers/Doctor');

router.post('/create', auth.clinicClaimsMiddleware, DoctorController.create);
router.post('/addDate', auth.userClaimsMiddleware, DoctorController.addDate);
router.delete('/delete', auth.clinicClaimsMiddleware, DoctorController.delete);
router.delete('/deleteDate', auth.userClaimsMiddleware, DoctorController.deleteDate);


module.exports = router;