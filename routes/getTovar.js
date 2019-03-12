'use strict';
const express = require('express');
const router = express.Router();
const mongoClient = require("mongodb").MongoClient;
const pagination = require('pagination');

router.get('/*', function(req, res, next){
  var searchData;
  var DA = req.url.split('=');

  if(DA[0] !== "/"){
    searchData = DA[1].split(',');
  }

  var page = req.url.split('page=')[1];

  if(parseInt(page) === 1){
    var otTovar = 0;
    var doTovar = 18;
  }else{
    var otTovar = 18 * (parseInt(page)-1);
    var doTovar = otTovar + 18;
  }

  mongoClient.connect(global.baseIP, function(err, client){
    const db = client.db(global.baseName);
    const locale = db.collection("LOCALE");
    const users = db.collection("USERS");
    const menu = db.collection("MENU");
    const tovar = db.collection("TOVAR");
    const news = db.collection("NEWS");
    const contacts = db.collection("CONTACTS");

    if(err) return console.log(err);

    locale.find().toArray(function(err, resLocale){
      users.find({login: req.session.login}).toArray(function(err, resUsers){
        menu.find().sort({index: 1}).toArray(function(err, resMenu){
          let FILTER = {
            category: parseInt(searchData[0]),
          };

          if(searchData.length >= 2 ){
            FILTER.types = searchData[1].split('&')[0];
          }

          tovar.find(FILTER).toArray(function(err, resTovar){
            news.find().toArray(function(err, resNews){
              contacts.find().toArray(function(err, resContacts){
                var current_page = page;
                var paginator = new pagination.SearchPaginator({prelink: '/shop?c='+searchData[0]+','+searchData[1].split('&')[0], current: current_page, rowsPerPage: 18, totalResult: resTovar.length-1});
                var p = paginator.getPaginationData();

                res.render('tovar.ejs',{
                  isAdm: req.session.admin,
                  sessionUser: resUsers[0],
                  locale: resLocale[0][global.parseLanguage(req)].tovar,
                  menu: resMenu,
                  globalLocale:  resLocale[0][global.parseLanguage(req)],
                  contacts: resContacts[0],
                  numLang: global.parseNumLang(req),
                  tovarArr: resTovar.slice(otTovar, doTovar),
                  offLength: resTovar.length,
                  isPage: page,
                  paginate: p
                });
              });
            });
          });

        }); 
      }); 
    });

  });
});

module.exports = router;