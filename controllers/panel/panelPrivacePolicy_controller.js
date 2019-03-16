'use strict';
const express = require('express');
const router = express.Router();
const cookieParser = require('cookie-parser');
const mongoClient = require("mongodb").MongoClient;
const bParser = require('body-parser');

router.use(cookieParser());

router.post('/savePrivacePolicyText', function(req, res, next){
	if(req.session.admin){
		mongoClient.connect(global.baseIP, function(err, client){
			const db = client.db(global.baseName);
			const locale = db.collection("LOCALE");

			if(err) return console.log(err);	

			locale.find().toArray(function(err, resLoc){
				var oldLoc = resLoc[0];
				oldLoc.RU.privacepolicy.text = req.body.a;
				oldLoc.UA.privacepolicy.text = req.body.b;
				oldLoc.EN.privacepolicy.text = req.body.c;
				locale.updateOne({AI: 0} ,{$set: oldLoc});
				res.send({code: 500, className: 'nSuccess', message: 'Данные успешно обновлены!'});
			});								
		});	
	}else{
		res.send({code: 403, className: 'nError', message: 'У вас нет доступа!'})
	}
});
module.exports = router;