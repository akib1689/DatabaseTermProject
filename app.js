// libraries
const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

// middlewares/
const errorHandling = require('./middleware/error_handling');
// const auth = require('./middlewares/auth');

// router
const router = require('./router/index_router');

// app creation
const app = express();

// using libraries
// app.use(fileUpload({ createParentPath : true }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
// app.use(auth);
app.use(morgan('tiny'));

// setting ejs to be view engine
app.set('view engine', 'ejs');

// allow public directory
app.use(express.static('public'))

//app.set('strict routing', true);
// using router
app.use('/', router);

// using error handling middleware
app.use(errorHandling.notFound);
app.use(errorHandling.errorHandler);

module.exports = app;