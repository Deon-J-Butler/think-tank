const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser')

mongoose.connect('mongodb://127.0.0.1/demo-express', function(err, db){
    if (err) {
        console.log('Unable to connect to server. Please check server connection. Error:', err);
    } else {
        console.log('Connected to MongoDB');
    }
});

/*let db = mongoose.connection;


// Check connection
db.once('open', function(){
    console.log('Connected to MongoDB');
})

// Check for db errors
db.on('error', function(err){
    console.log(err);
})*/

// Init App
const app = express();

// Bring in models
let Article = require('./models/article');

// Load View Engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Body Parser
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false}))
//parse application/json
app.use(bodyParser.json())

// Home Route
app.get('/', function(req, res){
    Article.find({}, function (err, articles){
        if (err){
            console.log(err);
        } else {
            res.render('index', {
                title: 'Articles',
                articles: articles
            });
        }
    });
});


// Add Route
app.get('/article/add', function(req, res){
    res.render('add_article', {
        title: 'Add Article'
    });
});

// Add Submit POST Route
app.post('/article/add', function(req, res){
    let article = new Article();
    article.title = req.body.title;
    article.author = req.body.author;
    article.body = req.body.body;

    article.save(function(err){
        if(err){
            console.log('There was an error', err);
        } else {
            res.redirect('/');
        }
    })
});

// Start Server
app.listen(3000, function(){
    console.log('Server started on port 3000...');
});