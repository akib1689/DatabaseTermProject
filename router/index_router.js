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
const company_router = require('./company/company_router')
const driver_router = require('./driver/driver_router')


// ROUTE: home page
router.get('/', async (req, res) =>{

    res.render('layout.ejs', {
        title: 'Bus Management System',
        header : 'home_header',
        body : 'home_body',
        footer: 'footer',
        cssFileLink: '/assets/css/style.css',
        scripts: '/assets/js/main.js'
    });
});

router.get('/redirecting', ((req, res) => {
    if (!req.user.ROLE){
        req.flash('success_msg', 'Successfully Logged in as User')
        res.redirect('/user')
    }else if (req.user.ROLE === 'admin'){
        req.flash('success_msg', 'Successfully Logged in as System Admin')
        res.redirect('/admin')
    }else if (req.user.ROLE === 'owner'){
        req.flash('success_msg', 'Successfully Logged in as Company Admin')
        res.redirect('/company')
    }else if (req.user.ROLE === 'driver'){
        req.flash('success_msg', 'Successfully Logged in as Driver')
        res.redirect('/driver')
    }
}))


// setting up sub-routers
// all the user routes needs to be authenticated
router.use('/user', auth.authenticateUser, user_router)
router.use('/admin',auth.authenticateAdmin, admin_router)
router.use('/company',auth.authenticateCompanyAdmin, company_router)
router.use('/driver', auth.authenticateDriver, driver_router)
router.use('/public', public_router)
router.use('/auth', auth_router)



module.exports = router