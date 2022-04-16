const express = require('express');
const router = express.Router();
const {check, validationResult} = require('express-validator')
const bcrypt = require('bcryptjs')

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
            console.log(2);
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
                    console.log(3);
                    newUser.password = hash;
                    newUser.save(function (err) {
                        if (err) {
                            console.log(4);
                            console.log(err);
                            return;
                        } else {
                            console.log(5);
                            req.flash('success', 'Your account is activated!\nYou can now login.');
                            res.redirect('/users/login');
                        }

                    });
                });
            });
        }
    });

router.get('/login', function (req, res) {
    res.render('login');
});

module.exports = router;