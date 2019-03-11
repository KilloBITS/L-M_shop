'use strict';
const express = require('express');
const router = express.Router();
const cookieParser = require('cookie-parser');
const mongoClient = require("mongodb").MongoClient;
const bParser = require('body-parser');

router.use(cookieParser());

router.post('/getMapPoint', function(req, res, next){
	mongoClient.connect(global.baseIP, function(err, client){
		const db = client.db(global.baseName);
		const contacts = db.collection("CONTACTS");

		if(err) return console.log(err);	

		contacts.find().toArray(function(err, res_conf){
			var config_data = res_conf[0];
			res.send({code: 500, className: 'nSuccess', data: config_data.map_points})
		});		
	});
});

module.exports = router;
