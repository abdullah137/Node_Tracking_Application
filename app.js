const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const path = require('path');
const flash = require('connect-flash');
const session = require("express-session");
const passport = require('passport');
const MongoStore = require("connect-mongo");
const {engine} = require('express-handlebars');

// Load config variable
dotenv.config({ path: './config/config.env' });

const app = express();

// connection to the database
const connectDB = require('./config/db');

// calling the function
connectDB();

// Body Parser Configuration
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Setting Up Morgan
if(process.env.NODE_ENV == "development") {
    app.use(morgan('dev'));
}

// Setting static folder
app.use(express.static(path.join(__dirname, 'public')));

// Setting Our Engine
app.engine('.hbs', engine({
     extname:'.hbs',
     defaultLayout: false
}));
app.set('views', './views');
app.set('view engine', '.hbs');

// Session configuration
app.use(
    session({
        secret: 'Abdullah',
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({ mongoUrl: process.env.MONGO_URI })
    })
);

// Passport Configuration
require('./config/passport')(passport);

// Initializing passport middelware
app.use(passport.initialize());
app.use(passport.session());


// Connecting flash
app.use(flash());


// Setting global variables for the flash
app.use(function(req, res, next) {
    res.locals.error_msg = req.flash("error_msg");
    res.locals.success_msg = req.flash("success_msg");
    res.locals.error = req.flash("error");
    next();
});

// Setting the routes 
app.use('/', require('./routes/index'));
app.use('/user', require('./routes/user.js'));


const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server is running on 🔥  ${process.env.NODE_ENV} mode on 🚢 ${PORT}`));