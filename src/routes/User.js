// imports
const express = require('express');
const router = express.Router();
const auth = require('./middlewares/auth');

// cada controller define as funções que serão executadas em cada endpoint. 
const UserController = require('../controllers/User');

router.get('/list', auth.checkIfAuthenticated, UserController.list);
router.post('/create', auth.checkIfAuthenticated, UserController.create);
router.delete('/delete', auth.checkIfAuthenticated, UserController.delete);


module.exports = router;