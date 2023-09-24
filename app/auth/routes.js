const router = require('express').Router();
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const authController = require('./controller');

passport.use(new LocalStrategy({ usernameField: 'email' }, authController.localStrategy));
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.get('/me', authController.me);
router.get('/me/edit/:id', authController.editMe);

module.exports = router;
