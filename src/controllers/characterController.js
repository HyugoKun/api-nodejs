const mongoose = require('mongoose');

const charModel = mongoose.model('Character');
const userModel = mongoose.model('User');

module.exports = {

    async allCharacters(req, res) {
        let user = await userModel.findOne({ '_id': req.userId });

        if (!user.isAdmin === true) {
            let chars = await charModel.find({ 'user': req.userId });

            res.status(200).json(chars);

        } else {
            let chars = await charModel.find().populate('user');

            res.status(200).json(chars);
        }
    },

    async newCharacter(req, res) {
        try{
            let char = await new charModel({ ...req.body, user: req.userId });
            char.save().then(() => {
                res.status(200).json({
                    success: true,
                    message: 'Personagem criado'
                });
            });
        } catch (err) {
            res.status(500).json({
                success: false,
                message: 'Erro ao criar personagem'
            });
        }
    },

    async showCharacter(req, res) {
        let user = await userModel.findById(req.userId);

        if (!user.isAdmin) {
            let char = await charModel.findOne({ '_id': req.params.charId, 'user': req.userId });
            return res.status(200).json(char);
        } else {
            let charadm = await charModel.findById(req.params.charId);
            return res.status(200).json(charadm);
        }
    },

    
}