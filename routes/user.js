const express = require('express');
const router = express.Router();
const csurf = require('csurf');
const passport = require('passport');
const Cart = require('../models/cart');

const Order = require('../models/order');


const csrfProtection = csurf();
router.use(csrfProtection);

router.get('/profile', isLoggedIn, (req, res, next) => {
    Order.find({user: req.user})
        .then(docs=>{
            docs.forEach(order=>{
                let cart = new Cart(order.cart);
                order.items = cart.generateArray();
            });
            res.render('user/profile', {orders: docs});

        })
        .catch(err=>{
            res.write('Error!');
        });
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
    failureRedirect: '/user/signup',
    failureFlash: true
}), (req,res,next)=>{
    if(req.session.oldUrl){
        let oldUrl = req.session.oldUrl;
        req.session.oldUrl = null;
        res.redirect(oldUrl);
    }else{
        res.redirect('/user/profile');
    }
});


router.get('/login', (req, res, next) => {
    let messages = req.flash('error');
    res.render('user/login', {csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0})
});

router.post('/login', passport.authenticate('local.login', {
    failureRedirect: '/user/login',
    failureFlash: true
}), (req,res,next)=>{
    if(req.session.oldUrl){
        let oldUrl = req.session.oldUrl;
        req.session.oldUrl = null;
        res.redirect(oldUrl);
    }else{
        res.redirect('/user/profile');
    }
});

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
