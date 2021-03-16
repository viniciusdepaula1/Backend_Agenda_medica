const express = require('express');
const router = express.Router();
const UserController = require('../controllers/User');

router.get('/list', UserController.list);
router.post('/create', UserController.create);
router.delete('/delete', UserController.delete);


module.exports = router;