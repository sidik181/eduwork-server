const User = require('../user/model');
const bcrypt = require('bcrypt');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config');
const { getToken } = require('../../utils');

const register = async (req, res, next) => {
    try {
        const payload = req.body;
        let user = new User(payload);
        await user.save();
        return res.json(user);
    } catch (err) {
        if (err && err.name === 'ValidationError') {
            return res.json({
                error: 400,
                message: err.message,
                fields: err.errors
            });
        }
        next(err);
    }
}

const localStrategy = async (email, password, done) => {
    try {
        let user = await User
            .findOne({ email })
            .select('-__v -createdAt -updatedAt -cart_items -token');

        if (!user) return done();
        if (bcrypt.compareSync(password, user.password)) {
            ({ password, ...userWithoutPassword } = user.toJSON());
            return done(null, userWithoutPassword);
        }
    } catch (err) {
        done(err, null)
    }
    done();
}

const login = (req, res, next) => {
    passport.authenticate('local', async function (err, user) {
        if (err) return next(err);

        if (!user) return res.json({
            error: 403,
            message: 'Email atau password salah!'
        });

        let signed = jwt.sign(user, config.secretKey);

        await User.findByIdAndUpdate(user._id, { $push: { token: signed } });
        return res.json({
            message: 'Login Berhasil',
            user,
            token: signed
        });
    })(req, res, next)
}

const logout = async (req, res, next) => {
    let token = getToken(req);

    await User.findOneAndUpdate({ token: { $in: [token] } }, { $pull: { token: token } }, { userFindAndModify: false });

    if (!token) {
        return res.status(400).json({
            error: 400,
            message: 'Tidak ada user!'
        });
    }

    return res.status(200).json({
        message: 'Berhasil Logout'
    });
}


const me = (req, res, next) => {
    let token = getToken(req);

    if (!req.user || !token) {
        return res.status(403).json({
            error: 403,
            message: 'Anda belum login atau token expired!'
        });
    } else {
        return res.status(200).json(req.user);
    }
}
module.exports = {
    register,
    localStrategy,
    login,
    logout,
    me
}