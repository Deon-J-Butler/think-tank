const express = require('express');
const Article = require("../models/article");
const {check, validationResult} = require("express-validator");
const router = express.Router();



// Add article route (GET)
router.get('/articles/add', function(req, res){
    res.render('add_article', {
        title: 'Add Article'
    });
});

// Add article route (POST)
router.post('/articles/add', [
    check('title', 'Title must not be empty').notEmpty(),
    check('author', 'Author must not be empty').notEmpty(),
    check('body', 'Body must not be empty').notEmpty(),
], (req, res) => {

    //Get errors
    const errors = validationResult(req);
    if(errors) {
        res.render('add_article', {
            title: 'Add Article',
            errors: errors
        });
    } else {
        let article = new Article();
        article.title = req.body.title;
        article.author = req.body.author;
        article.body = req.body.body;

        article.save((err) => {
            if(err) {
                console.log(err);
            } else {
                req.flash('success', 'Article Added');
                res.redirect('/');
            }
        });
    }

});

// Edit form (GET)
router.get('/edit/:id', function(req, res){
    Article.findById(req.params.id, function(err, article){
        res.render('edit_article', {
            title: 'Edit Article',
            article:article
        });
    });
});

// Update article (POST)
router.post('/edit/:id', function(req, res){
    let article = {};
    article.title = req.body.title;
    article.author = req.body.author;
    article.body = req.body.body;

    let query = {_id:req.params.id}

    Article.updateOne(query, article, function(err){
        if(err){
            console.log('There was an error', err);
        } else {
            req.flash('success', 'Article Updated');
            res.redirect('/');
        }
    });
});

// Delete article ($.ajax)
router.delete('/:id', function(req, res){
    let query = {_id:req.params.id}

    Article.deleteOne(query, function (err){
        if(err){
            console.log(err);
        }
        req.flash('danger', 'Article Deleted');
        res.send('Success');
    });
});

// Article route
router.get('/:id', function(req, res){
    Article.findById(req.params.id, function(err, article){
        res.render('article', {
            article:article
        });
    });
});

module.exports = router;