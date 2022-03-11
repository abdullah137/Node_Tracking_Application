const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const {engine} = require('express-handlebars');

// Load config variable
dotenv.config({ path: './config/config.env' });

const app = express();

// Body Parser
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Logging out time response
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

// Setting the routes 
app.use('/', require('./routes/index'));
app.use('/user', require('./routes/user.js'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server is running on 🔥  ${process.env.NODE_ENV} mode on 🚢 ${PORT}`));