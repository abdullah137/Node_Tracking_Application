const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const path = require('path');
const flash = require('connect-flash');
const session = require("express-session");
const passport = require('passport');
const http = require('http');
const socketio = require('socket.io');
const MongoStore = require("connect-mongo");
const {engine} = require('express-handlebars');


const {formatMessage, object_With_resume} = require('./utils/messages');
const { userOnline, getCurrentUser, userOffline, getRoomUsers } = require('./utils/user');

// Load config variable
dotenv.config({ path: './config/config.env' });

const app = express();

const server = http.createServer(app)
const io = socketio(server);

// connection to the database
const connectDB = require('./config/db');

// calling the function
connectDB();

// Body Parser Configuration
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Setting Up Morgan
if(process.env.NODE_ENV == "development") {
  //  app.use(morgan('dev'));
}

// Setting static folder
app.use(express.static(path.join(__dirname, 'public')));

// Handlebars Helpers
const { json, ifequals } = require('./helpers/hbs');

// Setting Our Engine
app.engine('.hbs', engine({
     helpers: { json, ifequals },
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

// Set global var
app.use(function(req, res, next) {
    res.locals.user = req.user || null
    next()
})


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


// socket io is here
io.on('connection', socket => {

    socket.on('joinUser', (object) => {
       
        const user = userOnline(socket.id, object.sessionId, object.roomId);

        socket.join(user.room)

        // console.log("It is connected here", socket);
        socket.emit('message', formatMessage('Application', 'Welcome to chatcord'))

         // Broadcast when a user connects // then put time login here
         socket.broadcast.to(user.room).emit('message', formatMessage('Application', `${object.userId} user has joined the chat`));
                
        // send users and room info
        io.to(user.room).emit('roomUsers', {
        
        });

    });

    // Listen for Chatmessage
    socket.on('chatMessage', ({sessionId, msg}) => {
        const user = getCurrentUser(socket.id);
        io.emit('message', object_With_resume('USER', sessionId,  msg))
    });

    // Runs when client disconnects
    socket.on('disconnect', () => {   

        const user = getCurrentUser(socket.id);

        console.log(user);

        io.emit('message', formatMessage('Application', 'A user has left the chat'))
    });
})

const PORT = process.env.PORT || 5000;

server.listen(PORT, console.log(`Server is running on 🔥  ${process.env.NODE_ENV} mode on 🚢 ${PORT}`));