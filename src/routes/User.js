// imports
const express = require('express');
const router = express.Router();
const auth = require('./middlewares/auth');

// cada controller define as funções que serão executadas em cada endpoint. 
const UserController = require('../controllers/User');

router.post('/create', auth.createMiddlewareClaims, UserController.create);
router.get('/list', auth.userClaimsMiddleware, UserController.list);
router.delete('/delete', auth.userClaimsMiddleware, UserController.delete);

module.exports = router;