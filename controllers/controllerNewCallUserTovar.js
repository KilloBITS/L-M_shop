'use strict';
const express = require('express');
const router = express.Router();
const cookieParser = require('cookie-parser');
const mongoClient = require("mongodb").MongoClient;
const bParser = require('body-parser');

router.use(cookieParser());

router.post('/getMessagesFromTovar', function(req, res, next){
	mongoClient.connect(global.baseIP, function(err, client){
		const db = client.db(global.baseName);
		const sub = db.collection("SUBSCRIPTION");
		if(err) return console.log(err);

		sub.find({email: req.session.a}).toArray(function(err, results){
			if(results[0] !== undefined){
				res.send({code: 450, msg: 'Вы уже подписсаны на наши новости!'});
			}else{
				var NEWUSER = {};
				NEWUSER.email = req.body.a;
				sub.insertOne(NEWUSER);
				res.send({code: 500, msg: 'Вы успешно подписали на наши новости!'});
			}
		});		
	});
});

module.exports = router;
