const express = require('express');
const router = express.Router();
const {check, validationResult} = require('express-validator')
const bcrypt = require('bcryptjs');
const passport = require('passport')

// Bring in user model
let User = require("../models/user");

// Register form (GET)
router.get('/register', function (req, res) {
    res.render('register', {
        title: 'Register'
    });
});

// Process registration (POST)
router.post('/register', [
        check('name', 'Name is required').notEmpty(),
        check('email', 'Email is required').notEmpty(),
        check('email', 'Email format').isEmail(),
        check('username', 'Username is required').notEmpty(),
        check('password', 'Password is required').notEmpty(),
        check('password2', 'Passwords do not match'),
    ], (req, res) => {

        /*const name = req.body.name;
        const email = req.body.email;
        const username = req.body.username;
        const password = req.body.password;
        const password2 = req.body.password2;*/

        // Get errors
        let errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.render('register', {
                title: 'Register',
                errors: errors.errors
            });
        } else {
            let newUser = new User();
            newUser.name = req.body.name;
            newUser.email = req.body.email;
            newUser.username = req.body.username;
            newUser.password = req.body.password;

            bcrypt.genSalt(10, function (err, salt) {
                bcrypt.hash(newUser.password, salt, function (err, hash) {
                    if (err) {
                        console.log(err);
                    }
                    newUser.password = hash;
                    newUser.save(function (err) {
                        if (err) {
                            console.log(err);
                        } else {
                            req.flash('success', 'Your account is activated! You can now login.');
                            res.redirect('/users/login');
                        }

                    });
                });
            });
        }
    });

// Login form
router.get('/login', function (req, res, next) {
    res.render('login');
});

// Login process
router.post('/login', function(req,res){
    passport.authenticate('local', {
        successRedirect:'/',
        failureRedirect:'/users/login',
        failureFlash: true
    })(req,res);
});

// Logout
router.get('/logout', function(req, res){
    req.logout();
    req.flash('success', 'You are logged out');
    res.redirect('/users/login');
});

module.exports = router;