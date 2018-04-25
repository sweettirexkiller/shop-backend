var express = require('express');
var router = express.Router();
var Product = require('../models/product');

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
