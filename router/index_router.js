// libraries
const express = require('express');

const router = express.Router({mergeParams : true});

//
// const blogUtils = require(process.env.ROOT + '/utils/blog-utils');
//
// // sub-routers
const user_router = require('./user/user');
const public_router = require('./public/public_router')
// const playerRouter = require('./player/player');
// const loginRouter = require('./auth/login');
// const logoutRouter = require('./auth/logout');
// const userRouter = require('./users/users.js');
// const profileRouter = require('./profile/profile');
// const blogRouter = require('./blog/blog');
// const countryRouter = require('./country/countryAll');
// const contestRouter = require('./contest/contest');
// const problemsRouter = require('./problems/problems');
// const apiRouter = require('./api/api');
// const teamsRouter = require('./teams/teams');
// const aboutRouter = require('./about/about');
//
// const rightPanelUtils = require('../utils/rightPanel-utils');

// ROUTE: home page
router.get('/', async (req, res) =>{

    res.render('layout.ejs', {
        title: 'Bus Management System',
        body : 'home_body'
    });
});

router.use('/user', user_router)
router.use('/public', public_router)

// setting up sub-routers
// router.use('/player', playerRouter);
// router.use('/login', loginRouter);
// router.use('/logout', logoutRouter);
// router.use('/users', userRouter);
// router.use('/profile', profileRouter);
// router.use('/blog', blogRouter);
// router.use('/country', countryRouter);
// router.use('/contest', contestRouter);
// router.use('/api', apiRouter);
// router.use('/problems', problemsRouter);
// router.use('/team', teamsRouter);
// router.use('/about', aboutRouter);


module.exports = router