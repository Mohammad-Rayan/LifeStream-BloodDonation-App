const jwt = require('jsonwebtoken');

const authenticate = async (req, res, next) => {
    try{
        const token = req.headers.authorization?.split(' ')[1];
        if(!token)
        {
            res.status(401).json({error: 'Token Not Found'});
        }

        const decode=jwt.verify(token, process.env.JWT_SECRET);
        req.user=decode;
        next();
    }
    catch(err)
    {
        console.error('JWT verification error:', err.message);
        res.status(401).json({ error: 'Invalid or expired token.' });
    }
};

module.exports = authenticate;