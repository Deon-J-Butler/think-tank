const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');
const config = require('../config/database');
const bcrypt = require('bcryptjs');

module.exports = function(passport){
    // Local strategy
    passport.use(new LocalStrategy(function (username, password, done){
        // Match username
        let query = {username:username};
        User.findOne(query, function(err, user){
            if(err) throw err;
            if(!user) {
                return done(null, false, {message: 'No user found'});
            }

            // Match password
            bcrypt.compare(password, user.password, function(err, isMatch){
                if(err) throw err;
                if(isMatch){
                    return done(null, user);
                } else {
                    return done(null, false, {message: 'Incorrect password'});
                }
            });
        });
    }));

    passport.serializeUser(function(user, cb) {
        process.nextTick(function() {
            cb(null, { id: user.id, username: user.username });
        });
    });

    passport.deserializeUser(function(user, cb) {
        process.nextTick(function() {
            return cb(null, user);
        });
    });
}