var GOOGLE_CLIENT_ID = "193091724219-6ievuo02hn4lm640f4kl9t9l04bc4n93.apps.googleusercontent.com";
var GOOGLE_CLIENT_SECRET = "DpzekjaDjggfz-QX6iYirYgo";

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

mongoose.connect(
    'mongodb://' + global.baseIP + ':' + 27017 + '/' + global.baseName,
    {
        useUnifiedTopology: true,
        useNewUrlParser: true
    }
);

const GoogleStrategy = require('passport-google-oauth2').Strategy;
const UsersSchema = mongoose.Schema({
    nick: String,
    name: String,
    email: String,
    secret: String,
    password: String,
    rank: Number,
    stars: Number,
    AI: Number,
    isAdmin: Boolean,
    ava: String,
    phone: String,
    desires: [Number],
    payments: [{
        tov: [String],
        date: String,
        payType: Number,
        dostType: Number,
        status: Number
    }],
    LM_COIN: Number,
    official: Boolean,
    phone_number: String
});
const UserModel = mongoose.model('users', UsersSchema);

const newID = () => {
    const aa = "id_" + Array(32).fill("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz").map(function (x) {
        return x[Math.floor(Math.random() * x.length)]
    }).join('');
    return aa
}
const newToken = () => {
    const aa = "t_" + Array(32).fill("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz").map(function (x) {
        return x[Math.floor(Math.random() * x.length)]
    }).join('');
    return aa
}


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
            if (err) {
                return done(err, null, null);
            }
            if (!user) { //Если пользователя нет,
                const createToken = newToken();
                const createID = newID();
                UserModel.countDocuments(function (err, c) {
                    var NEXT_AI = c + 1;

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
                        new CreateSystemLog(2, `Новый пользователь!`, c + 1);
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