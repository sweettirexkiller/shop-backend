var express = require('express');
var router = express.Router();
var Product = require('../models/product');
var csurf = require('csurf');

var csrfProtection = csurf();
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
    res.render('user/signup', {csrfToken: req.csrfToken()})
});

router.post('/user/signup', (req,res,next)=> {
   res.redirect('/');
});

module.exports = router;
