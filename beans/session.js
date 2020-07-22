const isSession = function (req) {
    return {
        login: req.isAuthenticated(),
        admin: req.isAuthenticated()?req.session.passport.user.isAdmin:false,
        id: req.isAuthenticated()?req.session.passport.user.user_ID:null
    }
}

module.exports = isSession