const express = require('express');
const router = express.Router();
const {check, validationResult} = require('express-validator')
const bcrypt = require('bcryptjs');
const passport = require('passport')

// Bring in user model
let User = require("../models/user");

// Register form (GET)
router.get('/register', function (req, res) {
    res.render('register');
});

// Process registration (POST)
router.post('/register',
    async (req, res, next) => {

        const name = req.body.name;
        const email = req.body.email;
        const username = req.body.username;
        const password = req.body.password;
        const password2 = req.body.password2;

        await check('name', 'Name is required').notEmpty().run(req);
        await check('email', 'Email is required').notEmpty().run(req);
        await check('email', 'Email format').isEmail().run(req);
        await check('username', 'Username is required').notEmpty().run(req);
        await check('password', 'Password is required').notEmpty().run(req);
        await check('password', 'Passwords do not match').equals(req.body.password);

        // Get errors
        const errors = validationResult(req);
        if (!errors) {
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
                            return;
                        } else {
                            req.flash('success', 'Your account is activated!\nYou can now login.');
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