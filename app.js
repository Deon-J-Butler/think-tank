const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser')
const session = require('express-session')
const { check, validationResult } = require('express-validator');
const flash = require('connect-flash')
const passport = require('passport');
const config = require('./config/database');

mongoose.connect(config.database, function(err){
    if (err) {
        console.log('Unable to connect to server. Please check server connection. Error:', err);
    } else {
        console.log('Connected to MongoDB');
    }
});



// Init app
const app = express();

// Bring in models
let Article = require('./models/article');

// Load view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

//---------------------------------------------------Middleware---------------------------------------------------------

// Body parser middleware
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false}));
//parse application/json
app.use(bodyParser.json());

// Express session middleware
app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true,
}));

// Express messages middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
    res.locals.messages = require('express-messages')(req, res);
    next();
});

// Passport config
require('./config/passport')(passport);

app.use(passport.initialize());
app.use(passport.session());

app.get('*', function(req, res, next){
    res.locals.user = req.user || null;
    next();
})

//--------------------------------------------------------Routes--------------------------------------------------------

// Home route
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

// Route files
let articles = require('./routes/articles');
app.use('/articles', articles);
let users = require('./routes/users');
app.use('/users', users);

// Start Server
app.listen(3000, function(){
    console.log('Server started on port 3000...');
});