
var GOOGLE_CLIENT_ID = "193091724219-24mqhp9nmoht3hnc3qes610qapjf1q8v.apps.googleusercontent.com";
var GOOGLE_CLIENT_SECRET = "JLlg3oU_2kjrxjKrxrr_ncbL";

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth2').Strategy;

mongoose.connect(
    'mongodb://localhost:27017/SHOP',
    {
        useUnifiedTopology: true,
        useNewUrlParser: true
    }
);


const UsersSchema = require('./models/user');

const UserModel = mongoose.model('USERS', UsersSchema);

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (obj, done) {
    done(null, obj);
});

function parsePhotos(photos) {
    return photos.value
}

passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback",
    passReqToCallback: true
},
    function (request, accessToken, refreshToken, profile, done, req, res) {
        UserModel.findOne({
            email: profile.email
        }, function (err, user) {

            console.log(user)
            if (err) {
                return done(err, null, null);
            }
            if (!user) { //Если пользователя нет,
                UserModel.countDocuments(function (err, c) {
                    var NEXT_AI = c + 1;
                    var today = new Date();
                    var dd = today.getDate();
                    var mm = today.getMonth() + 1;
                    var yyyy = today.getFullYear();
                    if (dd < 10) {
                        dd = '0' + dd
                    }
                    if (mm < 10) {
                        mm = '0' + mm
                    }
                    today = mm + '-' + dd + '-' + yyyy;
                    user = new UserModel({
                        nick: profile.email.split('@')[0],
                        name: `${profile.given_name} ${profile.family_name}`,
                        email: profile.email,
                        phone_number: null,
                        secret: null,
                        password: null,
                        rank: 0,
                        stars: 0,
                        AI: NEXT_AI,
                        isAdmin: false,
                        ava: parsePhotos(profile.photos[0]),
                        desires: [],
                        payments: [],
                        LM_COIN: 0,
                        regiter_date: today,
                        official: false,
                        blocked: false,
                        provider: "google",
                        isPartner: false
                    });

                    user.save(function (err) {
                        if (err) console.log(err);
                        return done(err, user, null);
                    });
                });
            } else { //Если пользователь есть
                return done(err, user, null);
            }
        });
    }
));

router.get('/get/login/google', passport.authenticate('google', {
    scope:
        ['profile',
            'email',
            'https://www.googleapis.com/auth/plus.login',
            'https://www.googleapis.com/auth/plus.profile.emails.read']
}
));



module.exports = router;