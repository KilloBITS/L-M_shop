'use strict';
const express = require('express');
const router = express.Router();
const mongoClient = require("mongodb").MongoClient;
const bParser = require('body-parser');

router.post('/counters', function(req, res, next){
  mongoClient.connect(global.baseIP ,function(err, client){
   const db = client.db(global.baseName);
   const countersDB  = db.collection("counters");
   const tovar  = db.collection("tovar");
   const payments  = db.collection("payments");
   const counters  = db.collection("counters");
   if(err) return console.log(err);
   countersDB.find().toArray(function(err, results_counters){
     tovar.find().toArray(function(err, results_tovar){
       payments.find().toArray(function(err, results_payments){
         tovar.find({ sale: {$all: ["true"]}  }).toArray(function(err, results_sale){
             res.send({a:results_counters.length , b:results_tovar.length , c:results_payments.length , d:results_sale.length })
         });
       });
     });
   });
  });

});

module.exports = router;
