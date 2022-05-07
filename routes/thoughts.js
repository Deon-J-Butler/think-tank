const express = require('express');
const Thought = require('../models/thought');
const {check, validationResult} = require('express-validator');
const router = express.Router();
const User = require('../models/user')



// Add thought route (GET)
router.get('/add', ensureAuthenticated, function(req, res){
    res.render('add_thought', {
        title: 'Add Thought'
    });
});

// Add thought route (POST)
router.post('/add', [
    check('title', 'Title must not be empty').notEmpty(),
    check('body', 'Body must not be empty').notEmpty(),
], (req, res) => {

    //Get errors
    let errors = validationResult(req);
    if(!errors.isEmpty()) {
        res.render('add_thought', {
            title: 'Add Thought',
            errors: errors.errors
        });
    } else {
        let thought = new Thought();
        thought.title = req.body.title;
        thought.author = req.user._id;
        thought.body = req.body.body;

        thought.save((err) => {
            if(err) {
                console.log(err);
            } else {
                req.flash('success', 'Entry Added');
                res.redirect('/');
            }
        });
    }

});

// Edit form (GET)
router.get('/edit/:id', ensureAuthenticated, function(req, res){
    Thought.findById(req.params.id, function(err, thought){
        if (req.user.id !== thought.author) {
            req.flash('danger', 'Not Authorized');
            res.redirect('/');
        } else {
            res.render('edit_thought', {
                title: 'Edit Thought',
                thought: thought
            });
        }
    });
});

// Update thought (POST)
router.post('/edit/:id', function(req, res){
    let thought = {};
    thought.title = req.body.title;
    thought.author = req.user._id;
    thought.body = req.body.body;

    let query = {_id:req.params.id}

    Thought.updateOne(query, thought, function(err){
        if(err){
            console.log('There was an error', err);
        } else {
            req.flash('success', 'Entry Updated');
            res.redirect('/');
        }
    });
});

// Delete thought ($.ajax)
router.delete('/:id', function(req, res){
    if (!req.user._id) {
        res.status(500).send();
    } else {
        let query = {_id: req.params.id}

        Thought.findByIdAndDelete(req.params.id, function (err, thought) {
            if (!req.user._id) {
                res.status(500).send();
            } else {
                Thought.deleteOne(query, function (err) {
                    if (err) {
                        console.log(err);
                    }
                    req.flash('danger', 'Entry Deleted');
                    res.send('Success');
                });
            }
        });
    }
});

// Thought route
router.get('/:id', function (req, res) {
    Thought.findById(req.params.id, function (err, thought) {
        User.findById(thought.author, function (err, user) {
            res.render('entry', {
                thought: thought,
                author: user.name
            });
        });
    });
});

// Access Control
function ensureAuthenticated(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    } else {
        req.flash('danger', 'Please login');
        res.redirect('/users/login');
    }
}

module.exports = router;