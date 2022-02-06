// libraries
const express = require('express');

const router = express.Router({mergeParams : true});
const auth = require('./auth/ensureAuth')
//
// const blogUtils = require(process.env.ROOT + '/utils/blog-utils');
//
// // sub-routers
const user_router = require('./user/user');
const public_router = require('./public/public_router')
const auth_router = require('./auth/authenticate')
const admin_router = require('./admin/admin_router')

// ROUTE: home page
router.get('/', async (req, res) =>{

    res.render('layout.ejs', {
        title: 'Bus Management System',
        header : 'home_header',
        body : 'home_body'
    });
});


// setting up sub-routers
// all the user routes needs to be authenticated
router.use('/user', auth.authenticated, user_router)
router.use('/admin', admin_router)
router.use('/public', public_router)
router.use('/auth', auth_router)



module.exports = router