const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userModel = mongoose.model('User');

function generateToken(id) {
    const token = jwt.sign({ id }, process.env.SECRET, {
        expiresIn: 86400
    });

    return token;
}

module.exports = {

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
    },

    async deleteUser(req, res) {
        let user = await userModel.findOne({ '_id': req.userId });

        if (!req.body.username) return res.status(400).json({ success: false, message: 'O username é obrigatório'});

        let userDelete = await userModel.findOne({ 'username': req.body.username });

        if (!userDelete) return res.status(400).json({ success: false, message: 'Usuário não encontrado'});

        if(!user.isAdmin === true) return res.status(401).json({ success: false, message: 'Somente adms possuem autorização para isso'});

        userDelete.remove(() => {
            res.status(200).json({
                success: true,
                message: `Usuário ${req.body.username} teve sua conta apagada`
            });
        });
    },

    
};