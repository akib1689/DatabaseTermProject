// libraries
const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const session = require('express-session')
const flash = require('connect-flash')
const passport = require('passport')

require('./middleware/passport').validate(passport)

// middlewares/
const errorHandling = require('./middleware/error_handling');
// const auth = require('./middlewares/auth');

// router
const router = require('./router/index_router');

// app creation
const app = express();

// using libraries
// app.use(fileUpload({ createParentPath : true }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({
    secret : 'secret',
    resave : true,
    saveUninitialized : true
}))

//passport
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
})
app.use(cookieParser());
app.use(morgan('tiny'));

// setting ejs to be view engine
app.set('view engine', 'ejs');

// allow public directory
app.use(express.static('public'))



// using router
app.use('/', router);

// using error handling middleware
app.use(errorHandling.notFound);
app.use(errorHandling.errorHandler);

module.exports = app;