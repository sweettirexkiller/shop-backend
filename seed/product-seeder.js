var Product = require('../models/product');

var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/shoping', {promiseLibrary: require('bluebird')});

var products = [
    new Product({
        imagePath: 'https://upload.wikimedia.org/wikipedia/en/5/5e/Gothiccover.png',
        title: 'Gothic Video Game',
        description: "Awesome Game!",
        price: 10
    }),
    new Product({
        imagePath: 'https://images.g2a.com/newlayout/323x433/1x1x0/06114476276e/59108976ae653aa55c6ac1f2',
        title: 'Thw Witcher Wild Hunt',
        description: "Amazing Game!",
        price: 15
    }),
    new Product({
        imagePath: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQyUWh_P9xq4o3Rja1PZsHA7ydEMUZXBJyYuSlxD8UIXBdBjzt_',
        title: 'Fortnite',
        description: "Cool Shooter! Great fun!",
        price: 0
    }),
    new Product({
        imagePath: 'https://supermariorun.com/assets/img/hero/hero_chara_mario_update_pc.png',
        title: 'Mario',
        description: "Funny Game!",
        price: 2
    })
];
var done = 0;
for (var i =0; i< products.length; i++){
    products[i].save(function(err, result){
        done++;
        if(done  === products.length){
            exit();
        }
    });
}
function exit() {
    mongoose.disconnect();
}