const jwt = require('jsonwebtoken');
const authConfig = require('../config/auth.json');

module.exports = (req, res, next) => {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
        console.log("No token provider")
        return res.status(401).send({ error: 'No token provider' });
    }
    const parts = authHeader.split(' ');

    if (!parts.length == 2) {
        console.log("Token error")
        return res.status(401).send({ error: 'Token error!' });
    }

    const [scheme, token] = parts;

    if (!/^Bearer$/i.test(scheme)) {
        console.log("Token malFormatted")
        return res.status(401).send({ error: 'Token malFormatted' });
    }

    jwt.verify(token, authConfig.secret, (err, decoded) => {
        if (err) return res.status(401).send({ error: 'Token invalid' });

        req.userId = decoded.id;
        console.log("Token ok!")

        return next();
    });

};