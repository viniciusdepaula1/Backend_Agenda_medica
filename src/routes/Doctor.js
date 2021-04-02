// imports
const express = require('express');
const router = express.Router();
const auth = require('./middlewares/auth');

// cada controller define as funções que serão executadas em cada endpoint. 
const DoctorController = require('../controllers/Doctor');

router.post('/create', DoctorController.create);
router.post('/addDate', DoctorController.addDate);
router.delete('/delete', DoctorController.delete);

module.exports = router;