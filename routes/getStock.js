'use strict';
const express = require('express');
const router = express.Router();
const mongoClient = require("mongodb").MongoClient;
const pagination = require('pagination');

router.get('/*', function(req, res, next){
    var languageSystem, langMenu;
    languageSystem = 0;
    langMenu = 'menu';

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
      const config = db.collection("config");
      const titles_page = db.collection("titles_page");
      const menu  = db.collection(langMenu);
      const users_session = db.collection("users");
      const banners = db.collection("banners");

      var tovar  = db.collection("tovar");


      if(err) return console.log(err);

       titles_page.find().toArray(function(err, results_titles_page){
         config.find().toArray(function(err, results_config){
           if(results_config[languageSystem].opens){
             menu.find().sort({ index: 1 }).toArray(function(err, results_menu ){
               users_session.find({email: req.session.user}).toArray(function(err, results_users_session ){
                 if(results_users_session.length > 0){
                   var uSession = results_users_session;
                 }else{
                   var uSession = false;
                 }
                  try {
                    banners.find().toArray(function(err, banner ){
                      tovar.find( { sale: { $all : ["true"] } } ).sort( { AI: 1 } ).toArray(function(err, results_tovar ){
                        // console.log(results_tovar)

                        // console.log(otTovar)
                        // console.log(doTovar)
                        var current_page = page;
                        var paginator = new pagination.SearchPaginator({prelink: '/stock&'+req.url.split('&')[1], current: page, rowsPerPage: 18, totalResult: results_tovar.length-1});
                        var p = paginator.getPaginationData();

                        res.render('stock.ejs',{
                          conf: results_config[languageSystem],
                          menu: results_menu,
                          tovarArr: results_tovar.slice(otTovar, doTovar),
                          title: results_titles_page[languageSystem].tovar,
                          sessionUser: req.session.user,
                          users_data: uSession,
                          offLength: results_tovar.length,
                          isAdm: req.session.admin,
                          isPage: page,
                          paginate: p,
                          topBanner: ''
                        })
                        client.close();
                      });
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
