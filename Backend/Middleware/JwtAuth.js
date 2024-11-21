
const jwt = require('jsonwebtoken');
require('dotenv').config();

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    //Bearer token 
    if (token == null) return res.sendStatus(400);

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            console.log("JWT not Verified")
            return res.sendStatus({ error: "You must be a register user to use this function" });
        }
        req.user = user;

        next();
    });
}

module.exports = authenticateToken