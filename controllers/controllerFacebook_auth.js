// const express = require('express');
// const router = express.Router();
// const cookieParser = require('cookie-parser');
// const mongoClient = require("mongodb").MongoClient;
// const bParser = require('body-parser');

// const passport = require('passport');
// const FacebookStrategy = require('passport-facebook').Strategy;

// passport.use(new FacebookStrategy({
//   clientID: "331453347719986",
//   clientSecret: "aa26a8bf3d9f94463ff8d14610faea90",
//   callbackURL: "/auth/facebook/callback"
// },
// function(accessToken, refreshToken, profile, done) {
//   process.nextTick(function () {
//     if(config.use_database==='true')
//     {
//          //Further code of Database.
//        }
//        return done(null, profile);
//      });
// }
// ));

// router.get('/auth/facebook',
//   passport.authenticate('facebook'));

// router.get('/auth/facebook/callback',
//   passport.authenticate('facebook', { failureRedirect: '/login' }),
//   function(req, res) {
//     // Successful authentication, redirect home.
//     res.redirect('/');
//   });



// module.exports = router;
