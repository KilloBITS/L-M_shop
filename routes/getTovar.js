'use strict';
const express = require('express');
const router = express.Router();
const mongoClient = require("mongodb").MongoClient;
const pagination = require('pagination');

router.get('/*', function(req, res, next){
    var languageSystem, langMenu;
    languageSystem = 0;
    langMenu = 'menu';

    var searchData;
    var DA = req.url.split('=');

    if(DA[0] !== "/"){
      searchData = DA[1].split(',');
    }

    var page = req.url.split('page=')[1];

    if(parseInt(page) === 1){
      var otTovar = 0;
      var doTovar = 24;
    }else{
      var otTovar = 24 * page;
      var doTovar = otTovar + 24;
    }

    mongoClient.connect(global.baseIP, function(err, client){
      const db = client.db(global.baseName);
      const config = db.collection("config");
      const titles_page = db.collection("titles_page");
      const menu  = db.collection(langMenu);
      const users_session = db.collection("users");

      if(languageSystem === 0){
        var tovar  = db.collection("tovar");
      }else{
        var tovar  = db.collection("tovar-uk");
      }

      if(err) return console.log(err);

       titles_page.find().toArray(function(err, results_titles_page){
         config.find().toArray(function(err, results_config){
           if(results_config[languageSystem].opens){
             menu.find().sort({ isEnded: 1 }).toArray(function(err, results_menu ){
               users_session.find({email: req.session.user}).toArray(function(err, results_users_session ){
                 if(results_users_session.length > 0){
                   var uSession = results_users_session;
                 }else{
                   var uSession = false;
                 }
                  try {
                    let FILTER = {
                      category: parseInt(searchData[0]),
                    };


                    if(searchData.length >= 2 ){
                      FILTER.types = searchData[1].split('&')[0];
                    }

                    tovar.find( FILTER ).sort( { AI: -1 } ).toArray(function(err, results_tovar ){
                      var page_length = parseInt(results_tovar.length / 24);
                      var current_page = page;
                      console.log('/shop?c='+searchData[0]+','+searchData[1].split('&')[0])
                      console.log(results_tovar.length)
                      var paginator = new pagination.SearchPaginator({prelink: '/shop?c='+searchData[0]+','+searchData[1].split('&')[0], current: current_page, rowsPerPage: 24, totalResult: results_tovar.length});
                      var p = paginator.getPaginationData();
                      res.render('tovar.ejs',{
                        conf: results_config[languageSystem],
                        menu: results_menu,
                        tovarArr: results_tovar.slice(otTovar, doTovar),
                        title: results_titles_page[languageSystem].tovar,
                        sessionUser: req.session.user,
                        users_data: uSession,
                        offLength: results_tovar.length,
                        isAdm: req.session.admin,
                        isPage: page,
                        paginate: p
                      })
                      client.close();
                    });
                  } catch (e){
                    res.render('404.ejs',{
                      isAdm: req.session.admin
                    })
                  }
               });
             });
           }else{
             res.render('close.ejs',{
               conf: results_config[languageSystem],
               isAdm: req.session.admin
             })
           }
         });
       });
    });
});

module.exports = router;
