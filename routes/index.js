const express = require('express');
const router = express.Router();
const Product = require('../models/product');
const csurf = require('csurf');
const passport = require('passport');
const Cart = require('../models/cart');

const csrfProtection = csurf();
router.use(csrfProtection);

/* GET Home Shop page. */
router.get('/', function (req, res, next) {
    Product.find().then(docs => {
        productsChunk = [];
        const chunkSize = 3;
        for (let i = 0; i < docs.length; i += chunkSize) {
            productsChunk.push(docs.slice(i, i + chunkSize));
        }
        res.render('shop/index', {products: productsChunk});
    });
});

router.get('/add-to-cart/:id', (req, res, next) => {
    const productId = req.params.id;
    let cart = new Cart(req.session.cart ? req.session.cart : {});
    Product.findById(productId)
        .exec()
        .then(product=>{
            cart.add(product,product._id);
            req.session.cart = cart;
            console.log(req.session.cart);
            res.redirect('/');
        })
        .catch(err => {
            res.redirect('/');
        });
});

router.get('/shopping-cart', function (req, res, next) {
   if(!req.session.cart){
       return res.render('shop/shopping-cart', {products: null})
   }
   let cart = new Cart(req.session.cart);
   res.render('shop/shopping-cart', {products: cart.generateArray(),totalPrice: cart.totalPrice})
});

router.get('/checkout', function (req, res, next) {
    if(!req.session.cart){
        return res.redirect('/shopping-cart')
    }
    let cart = new Cart(req.session.cart);
    return res.render('shop/checkout', {total: cart.totalPrice})
});


module.exports = router;
