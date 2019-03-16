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
    const tovar  = db.collection("TOVAR");

    if(err) return console.log(err);

      // console.log(req.body.data)
      var result = arrayTovar.map(function (x) {
        return parseInt(x, 10);
      });
      var integerDataArray = result;
     tovar.find( { AI: { $in:  integerDataArray } } ).toArray(function(err, results_tovar ){
       var newArrayPush = [];

       for(let id = 0; id < integerDataArray.length; id++){
         for(let ir = 0; ir < results_tovar.length; ir++){
           if(parseInt(results_tovar[ir].AI) === integerDataArray[id]){
             newArrayPush.push(results_tovar[ir]);
           }
         }
       }

       res.send({code: 500, tovar: newArrayPush});
       client.close();
     });
  });
});

module.exports = router;
