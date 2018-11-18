'use strict';
const express = require('express');
const router = express.Router();
const cookieParser = require('cookie-parser');
const mongoClient = require("mongodb").MongoClient;
const bParser = require('body-parser');

router.use(cookieParser());


var yuliaMSG = (req, res, next) => {

  setTimeout(function(){
    res.send({msgNewServer:"Я сейчас нахожусь в разработке и мало чем могу вам помочь, но я могу передать ваше сообщение оператору, вы хотите этого ?"});
  },1580);

};
router.post('/to-yuliadMessage', yuliaMSG, function(req, res, next){});


module.exports = router;
