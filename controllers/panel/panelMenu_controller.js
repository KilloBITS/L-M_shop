'use strict';
const express = require('express');
const router = express.Router();
const cookieParser = require('cookie-parser');
const mongoClient = require("mongodb").MongoClient;
const bParser = require('body-parser');

router.use(cookieParser());

router.post('/removecategory', function(req, res, next){
	if(req.session.admin){
		mongoClient.connect(global.baseIP, function(err, client){
			const db = client.db(global.baseName);
			const menu = db.collection("MENU");
			if(err) return console.log(err);

			menu.remove({ index: parseInt(req.body.a)});
			res.send({code: 500, className: 'nSuccess', message: 'Категория успешно удалена!'});
		});
	}else{
		res.send({code: 403, className: 'nError', message: 'У вас нет доступа!'})
	}
});

router.post('/addtype', function(req, res, next){
	if(req.session.admin){
		mongoClient.connect(global.baseIP, function(err, client){
			const db = client.db(global.baseName);
			const menu = db.collection("MENU");
			if(err) return console.log(err);
			menu.find({categories: parseInt(req.body.b)}).toArray(function(err, resMenu){
				var DATA = req.body.a;
				var OLD = resMenu[0].podlink;
				if(resMenu[0].podlink[0] === '/'){
					OLD.shift();
				}
				OLD.push(DATA)
				resMenu[0].podlink = OLD;
				menu.updateOne({ categories: parseInt(req.body.b) } ,{ $set: resMenu[0] })
				// menu.find().toArray(function(err, resMenuData){
					res.send({code: 500, className: 'nSuccess', message: 'Категория успешно добавлена!'});
				// });

			});
		});
	}else{
		res.send({code: 403, className: 'nError', message: 'У вас нет доступа!'})
	}
});


router.post('/addcategory', function(req, res, next){
	if(req.session.admin){
		mongoClient.connect(global.baseIP, function(err, client){
			const db = client.db(global.baseName);
			const menu = db.collection("MENU");
			const config = db.collection("CONFIG");

			if(err) return console.log(err);

			menu.find().sort({index: -1}).limit(1).toArray(function(err, resMenu){
				menu.find().sort({categories: -1}).limit(1).toArray(function(err, resMenu2){
					config.find().toArray(function(err, resConfig){
						var newIndex = (resMenu.length === 0)?0:parseInt(resMenu[0].index) + 1;
						var DATA = req.body;
						DATA.index = newIndex;
						DATA.ml = 'menPoi' + DATA.index;
						DATA.edited = true;
						DATA.categories = (resMenu2.length === 0)?0:parseInt(resMenu2[0].categories) + 1;
						DATA.podlink = ['/'];
						DATA.glink = '/shop?c='+newIndex+'&page=1';

						var CONF = resConfig[0].categories;
						CONF.push({ name: DATA.name[0], index: DATA.index.toString() });

						config.updateOne({AI: 0},{$set: {categories:  CONF }})
						menu.insertOne(DATA);
						menu.find().toArray(function(err, resMenuData){
							res.send({code: 500, className: 'nSuccess', message: 'Категория успешно добавлена!', data: resMenuData});
						});
					});
				});
			});
		});
	}else{
		res.send({code: 403, className: 'nError', message: 'У вас нет доступа!'})
	}
});

router.post('/gettypes', function(req, res, next){
	if(req.session.admin){
		mongoClient.connect(global.baseIP, function(err, client){
			const db = client.db(global.baseName);
			const menu = db.collection("MENU");

			if(err) return console.log(err);

			menu.find({index: parseInt(req.body.a)}).toArray(function(err, resMenu){
				res.send({code: 500, className: 'nSuccess', message: 'Данные успешно обновлены!', data: resMenu[0]});
			});
		});
	}else{
		res.send({code: 403, className: 'nError', message: 'У вас нет доступа!'})
	}
});

router.post('/saveeditlink', function(req, res, next){
	if(req.session.admin){
		mongoClient.connect(global.baseIP, function(err, client){
			const db = client.db(global.baseName);
			const menu = db.collection("MENU");

			if(err) return console.log(err);

			menu.find({categories: parseInt(req.body.b)}).toArray(function(err, resMenu){
				var oldCat = resMenu[0];
				var getIndex = oldCat.podlink.findIndex(x => x.types === req.body.a.types);
				oldCat.podlink[getIndex] = req.body.a

				menu.update({categories: parseInt(req.body.b)} ,{$set: oldCat});
				res.send({code: 500, className: 'nSuccess', message: 'Данные успешно обновлены!'});
			});
		});
	}else{
		res.send({code: 403, className: 'nError', message: 'У вас нет доступа!'})
	}
});


module.exports = router;
