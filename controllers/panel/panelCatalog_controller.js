'use strict';
const express = require('express');
const router = express.Router();
const cookieParser = require('cookie-parser');
const mongoClient = require("mongodb").MongoClient;
const bParser = require('body-parser');

router.use(cookieParser());

router.post('/setcolor', function(req, res, next){
	if(req.session.admin){
		mongoClient.connect(global.baseIP, function(err, client){
			const db = client.db(global.baseName);
			const tovar = db.collection("TOVAR");

			if(err) return console.log(err);

			tovar.updateOne({AI: parseInt(req.body.b)},{$set: { "color" : req.body.a }})

			tovar.find().toArray(function(err, resTovar){
				res.send({code: 500, className: 'nSuccess', message: 'Цвет успешно присвоен!', data: resTovar});
			});								
		});	
	}else{
		res.send({code: 403, className: 'nError', message: 'У вас нет доступа!'})
	}
});


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




router.post('/saveTovar', function(req, res, next){
	if(req.session.admin){
		mongoClient.connect(global.baseIP, function(err, client){
			const db = client.db(global.baseName);
			const tovar = db.collection("TOVAR");

			if(err) return console.log(err);

			tovar.updateOne({AI: parseInt(req.body.b)},{$set: req.body.a });
			res.send({code: 500, className: 'nSuccess', message: 'Товар '+req.body.a.title[0]+' успешно добавлен!'});				
				
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
				var DATA = req.body;
				DATA.AI = (resTov.length === 0)?0:parseInt(resTov[0].AI) + 1;								
				DATA.views = 0;
				DATA.author = req.session.user;
				DATA.availability = true;
				DATA.date = global.getDate();

				tovar.insertOne(DATA);	
				res.send({code: 500, className: 'nSuccess', message: 'Товар '+req.body.title[0]+' успешно добавлен!'});				
			});		
		});		
	}else{
		res.send({code: 403, className: 'nError', message: 'У вас нет доступа!'})
	}
});
module.exports = router;