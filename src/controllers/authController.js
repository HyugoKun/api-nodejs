const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const userController = require('./userController');

const userModel = mongoose.model('User');

module.exports = {

    async loginUser(req, res) {
        const { username, password } = req.body;
        
        if (username && password) {
            const user = await userModel.findOne({ 'username': username }).select('+password');
            if (user) {
                if (await bcrypt.compare(password, user.password)) {
                    console.log(`OLHA AQUI: ${user.password} --- ${user.id}`);
                    res.status(200).json({
                        success: true,
                        token: userController.generateToken(user.id)
                    });
                } else {
                    res.status(500).json({
                        success: false,
                        message: 'Senha inválida'
                    });
                }
            } else {
                res.status(500).json({
                    success: false,
                    message: 'Usuário não existe'
                });
            }
        } else {
            res.status(500).json({
                success: false,
                message: 'Os campos usuário e senha são obrigatórios'
            });
        }
    }
}