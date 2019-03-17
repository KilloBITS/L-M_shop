'use strict';
const express = require('express');
const router = express.Router();
const mongoClient = require("mongodb").MongoClient;
const bParser = require('body-parser');

router.post('/getstatus', function(req, res, next){
  mongoClient.connect(global.baseIP ,function(err, client){
    const db = client.db(global.baseName);
    const users  = db.collection("USERS");
    const tovar  = db.collection("TOVAR");
    const payments  = db.collection("PAYMENTS");

    if(err) return console.log(err);
    users.find().toArray(function(err, resUsers){
      tovar.find().toArray(function(err, resTovar){
        payments.find().toArray(function(err, resPayments){
          tovar.find({ sale: {$all: ["true"]}  }).toArray(function(err, resSale){
            res.send({
              a: resUsers.length,
              b: resTovar.length,
              c: resPayments.length,
              d: resSale.length
            });
          });          
        });
      });
    });
  });
});

module.exports = router;
