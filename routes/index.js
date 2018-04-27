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




module.exports = router;
