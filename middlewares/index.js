const { getToken, policyFor } = require('../utils');
const jwt = require('jsonwebtoken');
const config = require('../app/config');
const User = require('../app/user/model');

const decodeToken = () => {
    return async function (req, res, next) {
        try {
            let token = getToken(req);

            if (!token) return next();

            req.user = jwt.verify(token, config.secretKey);
            let user = await User.findOne({ token: { $in: [token] } });

            if (!user) {
                return res.json({
                    error: 400,
                    message: 'Token Kadaluarsa. Silakan login kembali.'
                });
            }
        } catch (err) {
            if (err.name === 'JsonWebTokenError') {
                return res.status(401).json({
                    message: 'Token JWT tidak valid.!'
                });
            }

            if (err.name === 'jwt expired') {
                return res.status(401).json({
                    message: 'Token JWT telah kedaluwarsa.!'
                });
            }

            next(err);
        }

        return next();
    }
}

const policeCheck = (action, subject) => {
    return (req, res, next) => {
        let policy = policyFor(req.user);
        if (!policy.can(action, subject)) {
            return res.status(403).json({
                message: `Anda tidak diizinkan untuk ${action} ${subject}`
            });
        }
        next();
    }
}

module.exports = {
    decodeToken,
    policeCheck,
}