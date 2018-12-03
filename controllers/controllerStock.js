'use strict';
const express = require('express');
const router = express.Router();
const mongoClient = require("mongodb").MongoClient;
const bParser = require('body-parser');

router.post('/getStock', function(req, res, next){
  mongoClient.connect(global.baseIP ,function(err, client){
   const db = client.db(global.baseName);
   const stock  = db.collection("stock");

   if(err) return console.log(err);
   stock.find({id: req.body.id}).toArray(function(err, results_stock){
     res.send({data: results_stock});
   });
  });
});

module.exports = router;
