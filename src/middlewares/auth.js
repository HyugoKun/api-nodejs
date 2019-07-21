const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if(!authHeader) return res.status(401).json({ success: false, message: 'O token não foi enviado'});

    const parts = authHeader.split(' ');

    if(!parts === 2) return res.status(401).json({ success: false, message: 'Erro no token'});

    const [ scheme, token ] = parts;

    if(!/^Bearer$/i.test(scheme)) return res.status(401).json({ success: false, message: 'Token mal formatado'});

    jwt.verify(token, process.env.SECRET, (err, decoded) => {
        if (err) return res.status(401).json({ success: false, message: 'Token inválido'});

        req.userId = decoded.id;
        return next();
    });
};