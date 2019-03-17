'use strict';
const express = require('express');
const router = express.Router();
const cookieParser = require('cookie-parser');
const mongoClient = require("mongodb").MongoClient;
const bParser = require('body-parser');

router.use(cookieParser());

var updateAvaUser = (req, res, next) => {
    mongoClient.connect(global.baseIP, { useNewUrlParser: true } ,function(err, client){
      var db = client.db(global.baseName);
      var users = db.collection("users");

      if(err) return console.log(err);
      users.find({email: req.session.user}).toArray(function(err, results){
        if(results[0] !== undefined){
          var base64Data = req.body.newAva.replace(/^data:image\/(png|gif|jpeg|jpg);base64,/,'');
          require("fs").writeFile("./publick/data/avatars/" + results[0].AI + ".jpg", base64Data, 'base64', function(err) {
            res.send({code:500, img: req.body.n})
          });
        }else{
          res.send({code:430})
        }
        client.close();
      });
    });
};
router.post('/updateAvaUser', updateAvaUser, function(req, res, next){});

var addToJelaniya = (req, res, next) => {
    mongoClient.connect(global.baseIP, { useNewUrlParser: true } ,function(err, client){
      var db = client.db(global.baseName);
      var users = db.collection("users");
      if(err) return console.log(err);
      users.find({email: req.session.user}).toArray(function(err, results_users){
        if(results_users[0] !== undefined){
          var nnn = results_users[0].desires.push(parseInt(req.body.numObj));
          users.update({email: req.session.user},{ $set : { desires: results_users[0].desires}});
          res.send({code: 500});
        }else{
          res.send({code:430});
        }
        client.close();
      });
    });
};
router.post('/addToJelaniya', addToJelaniya, function(req, res, next){});

module.exports = router;
