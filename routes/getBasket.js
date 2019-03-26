'use strict';
const express = require('express');
const router = express.Router();
const mongoClient = require("mongodb").MongoClient;
// const url = "mongodb://localhost:27017/"; //url from mongoDB dataBase

router.get('/', function(req, res, next){
	global.visitors(req);
	res.render('pages/basket.ejs',{
		isAdm: req.session.admin
	})
});

module.exports = router;
