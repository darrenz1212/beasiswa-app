const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController'); // Pastikan jalur relatif benar

router.get('/', userController.index);
router.get('/get-user', userController.getUser);
router.get('/:userID', userController.getUserById);
router.post('/', userController.addUser);
router.put('/:userID', userController.updateUser);
router.delete('/:userID', userController.deleteUser);

module.exports = router;
