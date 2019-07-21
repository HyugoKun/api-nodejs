const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userModel = mongoose.model('User');

module.exports = {

    generateToken(id) {
        const token = jwt.sign({ id }, process.env.SECRET, {
            expiresIn: 86400
        });
    
        return token;
    },

    async allUsers(req, res) {
        let users = await userModel.find();
        return res.status(200).json(users);
    },

    async newUser(req, res) {
        if (req.body.username && req.body.password) {
            if (req.body.password2 && (req.body.password === req.body.password2)) {

                userModel.findOne({ 'username': req.body.username })
                    .then(user => {
                        if (user) {
                            res.status(500).json({
                                success: false,
                                message: 'O usuário já existe'
                            });
                        } else {
                            bcrypt.hash(req.body.password, 10)
                                .then(hash => {
                                    let encryptedPassword = hash;

                                    let newUser = new userModel({
                                        username: req.body.username,
                                        password: encryptedPassword,
                                        isAdmin: req.body.isAdmin
                                    });

                                    newUser.save()
                                        .then(() => {
                                            let id = newUser.id;
                                            res.status(200).json({
                                                success: true,
                                                token: generateToken(id)
                                            });
                                        })
                                        .catch(err => {
                                            res.status(500).json({
                                                success: false,
                                                error: err
                                            });
                                        });
                                });
                        }
                    })


            } else {
                res.status(500).json({
                    success: false,
                    error: 'Senhas diferem'
                });
            }
        } else {
            res.status(500).json({
                success: false,
                error: 'Usuário e senha são necessários'
            });
        }
    }
};