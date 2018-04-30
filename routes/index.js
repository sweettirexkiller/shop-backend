const express = require('express');
const router = express.Router();
const Product = require('../models/product');
const csurf = require('csurf');
const passport = require('passport');
const Cart = require('../models/cart');
const Order = require('../models/order');

const csrfProtection = csurf();
router.use(csrfProtection);

/* GET Home Shop page. */
router.get('/', function (req, res, next) {
    var successMessage = req.flash('success')[0];
    Product.find().then(docs => {
        productsChunk = [];
        const chunkSize = 3;
        for (let i = 0; i < docs.length; i += chunkSize) {
            productsChunk.push(docs.slice(i, i + chunkSize));
        }
        res.render('shop/index', {products: productsChunk,successMessage: successMessage, noMessage: !successMessage});
    });
});

router.get('/reduce/:id',  (req, res, next) => {
    const productId = req.params.id;
    let cart = new Cart(req.session.cart ? req.session.cart : {});

    cart.reduceByOne(productId);
    req.session.cart = cart;
    res.redirect('/shopping-cart');
});

router.get('/remove/:id',  (req, res, next) => {
    const productId = req.params.id;
    let cart = new Cart(req.session.cart ? req.session.cart : {});

    cart.removeItem(productId);
    req.session.cart = cart;
    res.redirect('/shopping-cart');
});

router.get('/add-to-cart/:id', (req, res, next) => {
    const productId = req.params.id;
    let cart = new Cart(req.session.cart ? req.session.cart : {});
    Product.findById(productId)
        .exec()
        .then(product => {
            cart.add(product, product._id);
            req.session.cart = cart;
            console.log(req.session.cart);
            res.redirect('/');
        })
        .catch(err => {
            res.redirect('/');
        });
});

router.get('/shopping-cart', function (req, res, next) {
    if (!req.session.cart) {
        return res.render('shop/shopping-cart', {products: null})
    }
    let cart = new Cart(req.session.cart);
    res.render('shop/shopping-cart', {products: cart.generateArray(), totalPrice: cart.totalPrice})
});

router.get('/checkout',isLoggedIn, function (req, res, next) {
    if (!req.session.cart) {
        return res.redirect('/shopping-cart')
    }
    let cart = new Cart(req.session.cart);
    var errMsg = req.flash('error')[0];
    return res.render('shop/checkout', {total: cart.totalPrice, errMsg: errMsg, noError: !errMsg,csrfToken: req.csrfToken()})
});

router.post('/checkout', isLoggedIn, function (req, res, next) {
    if (!req.session.cart) {
        return res.redirect('/shopping-cart')
    }
    let cart = new Cart(req.session.cart);
    // Set your secret key: remember to change this to your live secret key in production
    // See your keys here: https://dashboard.stripe.com/account/apikeys
    var stripe = require("stripe")("sk_test_uwyAZ1VZDRJrWxNEk2eACM6I");

    // Token is created using Checkout or Elements!
    // Get the payment token ID submitted by the form:
    const token = req.body.stripeToken; // Using Express

    const charge = stripe.charges.create({
        amount: cart.totalPrice * 100,
        currency: 'usd',
        description: 'Example charge',
        source: token,
    }).then(charge=>{
        let order = new Order({
            user: req.user,
            cart: cart,
            address: req.body.address,
            name: req.body.name,
            paymentId: charge.id
        });
        order.save()
            .then(doc=>{
                req.flash('success', 'Successfully bought product!');
                req.session.cart = null;
                res.redirect('/');
            })
            .catch(err=>{

            });

    }).catch(err=>{
        req.flash('error', err.message);
        res.redirect('/checkout');
    });
});


function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.session.oldUrl = req.url;
    res.redirect('/user/login');
};


module.exports = router;
