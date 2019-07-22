const express = require('express');
const userController = require('./controllers/userController');
const authController = require('./controllers/authController');
const charController = require('./controllers/characterController');
const authMiddleware = require('./middlewares/auth');

const routes = express.Router();

routes.get('/users',authMiddleware, userController.allUsers);
routes.post('/register', userController.newUser);
routes.post('/login', authController.loginUser);
routes.delete('/delete',authMiddleware, userController.deleteUser);

routes.get('/chars', authMiddleware, charController.allCharacters);
routes.post('/newchar', authMiddleware, charController.newCharacter);
routes.get('/showchar/:charId', authMiddleware, charController.showCharacter);

module.exports = routes;