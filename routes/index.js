const express = require('express');
const router = express.Router();
const Product = require('../models/product');
const csurf = require('csurf');
const passport = require('passport');

const csrfProtection = csurf();
router.use(csrfProtection);

/* GET Home Shop page. */
router.get('/', function (req, res, next) {
    Product.find().then(docs => {
        productsChunk = [];
        const chunkSize = 3;
        for (let i =0; i < docs.length; i+=chunkSize){
            productsChunk.push(docs.slice(i,i+chunkSize));
        }
        res.render('shop/index', {products: productsChunk});
    });
});

router.get('/user/signup', (req,res,next)=> {
    let messages = req.flash('error');
    res.render('user/signup', {csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0})
});

router.post('/user/signup', passport.authenticate('local.signup', {
    successRedirect: '/user/profile',
    failureRedirect: '/user/signup',
    failureFlash: true
}));

router.get('/user/profile', (req,res,next)=>{
    res.render('user/profile')
});

router.get('/user/signin', (req,res,next)=> {
    let messages = req.flash('error');
    res.render('user/signin', {csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0})
});

router.post('/user/signin', passport.authenticate('local.signin', {
    successRedirect: '/user/profile',
    failureRedirect: '/user/signin',
    failureFlash: true
}));


module.exports = router;
