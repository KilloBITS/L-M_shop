const mongoose = require('mongoose');
// Users Schema
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

module.exports = UsersSchema;