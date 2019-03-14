'use strict';
const express = require('express');
const router = express.Router();
const cookieParser = require('cookie-parser');
const mongoClient = require("mongodb").MongoClient;
const bParser = require('body-parser');

router.use(cookieParser());

router.post('/getTypesOfCatalog', function(req, res, next){
	if(req.session.admin){
		mongoClient.connect(global.baseIP, function(err, client){
			const db = client.db(global.baseName);
			const menu = db.collection("MENU");

			if(err) return console.log(err);	

			menu.find({categories: parseInt(req.body.a)}).toArray(function(err, resMenu){
				res.send({code: 500, className: 'nSuccess', data:resMenu[0].podlink});
			});								
		});	
	}else{
		res.send({code: 403, className: 'nError', message: 'У вас нет доступа!'})
	}
});

//Добавить новость
router.post('/addTovar', function(req, res, next){
	if(req.session.admin){
		mongoClient.connect(global.baseIP, function(err, client){
			const db = client.db(global.baseName);
			const tovar = db.collection("TOVAR");

			if(err) return console.log(err);

			tovar.find().sort({AI: -1}).limit(1).toArray(function(err, resTov){
				if(resTov.length === 0){
					var newAI = 0;
				}else{
					var newAI = parseInt(resTov[0].AI) + 1;
				}
				
				var DATA = req.body;
				DATA.AI = newAI;								
				DATA.views = 0;
				DATA.author = req.session.user;
				DATA.availability = true;
				tovar.insertOne(DATA);	
				res.send({code: 500, className: 'nSuccess', message: 'Товар '+req.body.title[0]+' успешно добавлен!'});				
			});		
		});		
	}else{
		res.send({code: 403, className: 'nError', message: 'У вас нет доступа!'})
	}
});
module.exports = router;