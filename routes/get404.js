'use strict';
const express = require('express');
const router = express.Router();
const mongoClient = require("mongodb").MongoClient;

router.get('*', function(req, res, next){
  res.render('pages/404.ejs',{
    isAdm: req.session.admin
  })
});

module.exports = router;
