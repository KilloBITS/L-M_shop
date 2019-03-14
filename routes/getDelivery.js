'use strict';
const express = require('express');
const router = express.Router();
const mongoClient = require("mongodb").MongoClient;

router.get('/*', function(req, res, next){
  var DA = req.url.split('?')[1];
  mongoClient.connect(global.baseIP, function(err, client){
    const db = client.db(global.baseName);
    const payments = db.collection("payments");

    if(err) return console.log(err);

     payments.find({id: DA}).toArray(function(err, results_payments){
       res.render('pages/delivery.ejs',{
         data: results_payments[0],
         isAdm: req.session.admin
       })
     });
  });
});

module.exports = router;
