// const express = require('express');
// const router = express.Router();
// const cookieParser = require('cookie-parser');
// const mongoClient = require("mongodb").MongoClient;
// const bParser = require('body-parser');

// const passport = require('passport');
// var Instagram = require('passport-instagram');
// const InstagramStrategy = Instagram.Strategy;

// passport.serializeUser((user, done) => {
//   done(null, user)
// })
// passport.deserializeUser((user, done) => {
//   done(null, user)
// })

// passport.use(new InstagramStrategy({
//   clientID: "89e795eb46f643cf86c51d7cd0b66849",
//   clientSecret: "ad15d5e24d5b46c199527e8165683a74",
//   callbackURL: "/auth/instagram/callback" 
// }, (accessToken, refreshToken, profile, done) => {
//   console.log(profile);
// }));

// router.get('/auth/instagram', passport.authenticate('instagram'));

// router.get(
//   '/auth/instagram/callback',
//   passport.authenticate('instagram', {
//     successRedirect: '/profile',
//     failureRedirect: '/login'
//   })
// );

// module.exports = router;
