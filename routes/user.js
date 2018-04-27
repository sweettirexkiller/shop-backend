const express = require('express');
const router = express.Router();
const csurf = require('csurf');
const passport = require('passport');

const csrfProtection = csurf();
router.use(csrfProtection);

router.get('/profile', isLoggedIn, (req, res, next) => {
    res.render('user/profile')
});

router.get('/logout', (req, res, next) => {
    req.logout();
    res.redirect('/');
});

router.use('/', notLoggedIn, function (res, req, next) {
    next();
});

router.get('/signup', (req, res, next) => {
    let messages = req.flash('error');
    res.render('user/signup', {csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0})
});

router.post('/signup', passport.authenticate('local.signup', {
    successRedirect: '/user/profile',
    failureRedirect: '/user/signup',
    failureFlash: true
}));


router.get('/login', (req, res, next) => {
    let messages = req.flash('error');
    res.render('user/login', {csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0})
});

router.post('/login', passport.authenticate('local.login', {
    successRedirect: '/user/profile',
    failureRedirect: '/user/login',
    failureFlash: true
}));

module.exports = router;


function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
};

function notLoggedIn(req, res, next) {
    if (!req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
};
