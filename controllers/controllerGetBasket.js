'use strict';
const express = require('express');
const router = express.Router();
const mongoClient = require("mongodb").MongoClient;
const bParser = require('body-parser');

router.post('/getbasket', function(req, res, next){
  var arrayTovar = [];
  for(let i = 0; i < req.body.data.length; i++){
    arrayTovar.push(req.body.data[i]);
  }

  mongoClient.connect(global.baseIP, function(err, client){
    const db = client.db(global.baseName);
    const tovar  = db.collection("tovar");

    if(err) return console.log(err);

    console.log(arrayTovar)
     tovar.find({vendorCode:  { $in: req.body.data } }).toArray(function(err, results_tovar ){
       res.send({code: 500, tovar: results_tovar});
       client.close();
     });
  });
});

module.exports = router;
