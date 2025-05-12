const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');

// Obtenir tous les utilisateurs (si admin)
router.get('/', userController.getAllUsers);

// Obtenir un utilisateur spécifique
router.get('/:id', userController.getUserById);


module.exports = router;
