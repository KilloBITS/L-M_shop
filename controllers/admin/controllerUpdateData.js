'use strict';
const express = require('express');
const router = express.Router();
const cookieParser = require('cookie-parser');
const mongoClient = require("mongodb").MongoClient;
const bParser = require('body-parser');

router.use(cookieParser());

//Обновление логотипа
var updateAva = (req, res, next) => {
  if (global.isAdminParse(req)) //&& req.session.admin && req.session.user !== undefined
  {
    var base64Data = req.body.n.replace(/^data:image\/(png|gif|jpeg|jpg);base64,/,'');
    require("fs").writeFile("./publick/image/Logo.png", base64Data, 'base64', function(err) {
      console.log(err);
      res.send({code:500, img: req.body.n})
    });
  }else{
    res.send({code: 403, msg: 'У вас нет доступа к данной операции!'});
  }

};
router.post('/updateAva', updateAva, function(req, res, next){});
///*******************************////

//Обновление заголовка
var saveTitle = (req, res, next) => {
  if (global.isAdminParse(req)) //&& req.session.admin && req.session.user !== undefined
  {
    mongoClient.connect(global.baseIP ,function(err, client){
      const db = client.db(global.baseName);
      const titles_page  = db.collection("titles_page");
      if(err) return console.log(err);
      /* Для русского языка */
      titles_page.update({LANG: "RU"},{ $set : { index: req.body.title_ru}});
      // Для украинского языка
      titles_page.update({LANG: "UA"},{ $set : { index: req.body.title_ua}});

      res.send({code:500})
      client.close();
    });
  }else{
    res.send({code: 403, msg: 'У вас нет доступа к данной операции!'});
  }

};
router.post('/saveTitle', saveTitle, function(req, res, next){});
///*******************************////

//Обновление статуса сайта
var siteStatus = (req, res, next) => {
  if (global.isAdminParse(req)) //&& req.session.admin && req.session.user !== undefined
  {
    mongoClient.connect(global.baseIP ,function(err, client){
      const db = client.db(global.baseName);
      const config  = db.collection("config");
      if(err) return console.log(err);
      /* Для русского языка */
      if(parseInt(req.body.status) === 0){
        config.update({LANG: "RU"},{ $set : { opens: true}});
        config.update({LANG: "UA"},{ $set : { opens: true}});
        res.send("Сайт запущен")
      }

      if(parseInt(req.body.status)  === 1){
        config.update({LANG: "RU"},{ $set : { opens: false}});
        config.update({LANG: "UA"},{ $set : { opens: false}});
        res.send("Сайт приостановлен")
      }

      if(parseInt(req.body.status)  === 2){
        res.send("Сайт обновлен")
      }

      client.close();
    });
  }else{
    res.send({code: 403, msg: 'У вас нет доступа к данной операции!'});
  }

};
router.post('/siteStatus', siteStatus, function(req, res, next){});
///*******************************////

//Обновление локализации на главной странице
var updateLocal = (req, res, next) => {
  if (global.isAdminParse(req)) //&& req.session.admin && req.session.user !== undefined
  {
    var a = req.body.ru;
    var b = req.body.ua;
    mongoClient.connect(global.baseIP ,function(err, client){
      const db = client.db(global.baseName);
      const config  = db.collection("config");

      if(err) return console.log(err);
      /* Для русского языка */
      config.update({LANG: "RU"},{ $set : { news_tovar: [a.news_titleNEW_ru, a.news_textNEW_ru, { btnTitle: a.news_btnNEW_ru, btnLink: "/shop"}]}});
      config.update({LANG: "RU"},{ $set : { about: [a.about_titleNEW_ru, a.about_textNEW_ru, { btnTitle: a.about_btnNEW_ru, btnLink: "/"}]}});
      config.update({LANG: "RU"},{ $set : { news: a.newsB_titleNEW_ru}});
      config.update({LANG: "RU"},{ $set : { contact: [a.mail_titleNEW_ru, a.mail_textNEW_ru]}});
      config.update({LANG: "RU"},{ $set : { input_submit: a.mail_btnNEW_ru}});
      // Для украинского языка
      config.update({LANG: "UA"},{ $set : { news_tovar: [b.news_titleNEW_ua, b.news_textNEW_ua, { btnTitle: b.news_btnNEW_ua, btnLink: "/shop"}]}});
      config.update({LANG: "UA"},{ $set : { about: [b.about_titleNEW_ua, b.about_textNEW_ua, { btnTitle: b.about_btnNEW_ua, btnLink: "/"}]}});
      config.update({LANG: "UA"},{ $set : { news: b.newsB_titleNEW_ua}});
      config.update({LANG: "UA"},{ $set : { contact: [b.mail_titleNEW_ua, b.mail_textNEW_ua]}});
      config.update({LANG: "UA"},{ $set : { input_submit: b.mail_btnNEW_ua}});

      res.send(req.body);
      client.close();
    });
  }else{
    res.send({code: 403, msg: 'У вас нет доступа к данной операции!'});
  }

};
router.post('/updateLocal', updateLocal, function(req, res, next){});
///*******************************////

//Обновление локализации на странице товаров
var updateLocalTovar = (req, res, next) => {
  if (global.isAdminParse(req)) //&& req.session.admin && req.session.user !== undefined
  {
    var a = req.body.ru;
    var b = req.body.ua;
    mongoClient.connect(global.baseIP ,function(err, client){
      const db = client.db(global.baseName);
      const config  = db.collection("config");
      console.log(a)
      console.log(b)
      if(err) return console.log(err);
      /* Для русского языка */
      config.update({LANG: "RU"},{ $set : { toBasket: a.btn_shopbas}});
      config.update({LANG: "RU"},{ $set : { btnDetails: a.btn_shopDetails}});
      // Для украинского языка
      config.update({LANG: "UA"},{ $set : { toBasket: b.btn_shopbas_ua}});
      config.update({LANG: "UA"},{ $set : { btnDetails: b.btn_shopDetails_ua}});

      res.send(req.body);
      client.close();
    });
  }else{
    res.send({code: 403, msg: 'У вас нет доступа к данной операции!'});
  }

};
router.post('/updateLocalTovar', updateLocalTovar, function(req, res, next){});
///*******************************////

var updateLoader = (req, res, next) => {
  if (global.isAdminParse(req)) //&& req.session.admin && req.session.user !== undefined
  {
    mongoClient.connect(global.baseIP ,function(err, client){
     const db = client.db(global.baseName);
     const config  = db.collection("config");

     if(err) return console.log(err);

      config.update({},{ $set : { loader: "load"+req.body.i+".gif"}}, {multi: true});
      res.send({code:500});
      client.close();
    });
  }else{
    res.send({code: 403, msg: 'У вас нет доступа к данной операции!'});
  }
};


router.post('/updateLoader', updateLoader, function(req, res, next){});

module.exports = router;
