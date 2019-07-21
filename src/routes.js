const express = require('express');
const userController = require('./controllers/userController');
const authController = require('./controllers/authController');
const routes = express.Router();

routes.get('/users', userController.allUsers);
routes.post('/register', userController.newUser);
routes.post('/login', authController.loginUser);

module.exports = routes;