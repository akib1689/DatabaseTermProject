// libraries
const express = require('express');

const router = express.Router({mergeParams: true});

const db_trip_api = require('../../service/db_trip_api');
const db_driver_api = require('../../service/db_driver_api');

router.get('/', async (req, res) => {
    res.render('layout.ejs', {
        title: 'User Home',
        body: 'user/user_home',
        footer: 'footer',
        partials: '../partials/messages',
        cssFileLink: '/assets/css/create_route_style.css'
    });
});

router.get('/create_trip', async (req, res,) => {
    // send location
    res.render('layout.ejs', {
        title: 'Create trip',
        body: 'user/create_trip_body',
        footer: 'footer',
        formPostUrl: '/user/create_trip',
        scripts: '/assets/js/create_trip.js',
        cssFileLink: '/assets/css/create_route_style.css'
    })
})

router.post('/create_trip', async (req, res,) => {
    // send location

    console.log(req.body);
    const {source, destination, route, bus} = req.body;
    let errors = [];
    if (!source || !destination || !route || !bus) {
        errors.push({
            message: 'Please fill up the form'
        })
    }

    if (isNaN(source) || isNaN(destination) || isNaN(route) || isNaN(bus)) {
        errors.push({
            message: 'The field must be ID of the fields'
        })
    }

    if (errors.length > 0) {
        return res.render('layout.ejs', {
            title: 'Create trip',
            body: 'user/create_trip_body',
            formPostUrl: '/user/create_trip',
            scripts: '/assets/js/create_trip.js',
            footer: 'footer',
            cssFileLink: '/assets/css/create_route_style.css',
            errors
        })
    }

    // passed the form

    // now access the user
    const user = req.user;
    if (!user) {
        // some error occurred the req is not valid now
        req.flash('error_msg', 'The user logged out for some reason')
        res.redirect('/user');
        return;
    }

    const check_trip = await db_trip_api.checkTrip(user.ID);
    if (check_trip.length > 0) {
        // user in already in a bus theoretically
        req.flash('error_msg', 'Can\'t create trip now. You\'re already using a trip')
        res.redirect('/user');
        return;
    }
    const insert_result = await db_trip_api.insertTrip(source, destination, bus, user.ID);
    if (insert_result && insert_result.rowsAffected > 0) {
        req.flash('success_msg', 'Successfully created a trip. Have a great Day!')
        res.redirect('/user');
        return;
    }

    req.flash('error_msg', 'Can\'t create trip now. Try again later')
    res.redirect('/user');


})


router.get('/end_trip', async (req, res) => {
    const running_trip = await db_trip_api.checkTrip(req.user.ID);
    res.render('layout.ejs', {
        title: 'End trip',
        body: 'user/end_trip',
        footer: 'footer',
        formPostUrl: '/user/end_trip',
        cssFileLink: '/assets/css/create_route_style.css',
        trips: running_trip
    })

})
router.post('/end_trip', async (req, res) => {

    const {param} = req.body;
    if (!param || param < 0) {
        req.flash('error_msg', 'There was no trip with the following id')
        res.redirect('/user')
        return;
    }


    const update_result = await db_trip_api.endTrip(param);
    if (update_result && update_result.rowsAffected > 0){
        let msg = 'Successfully ended the trip with id: ' + param;
        req.flash('success_msg', msg)
        res.redirect('/user')
        return;
    }
    req.flash('error_msg', 'Couldn\'t end trip now try again later')
    res.redirect('/user')

})
router.get('/rate_last', async (req, res) => {
    const finished_trip = await db_trip_api.checkFinishedTrip(req.user.ID);
    res.render('layout.ejs', {
        title: 'Rate trip',
        body: 'user/rate_last',
        formPostUrl: '/user/rate_last',
        footer: 'footer',
        cssFileLink: '/assets/css/rating.css',
        trips: finished_trip
    })
})
router.post('/rate_last', async (req, res) => {
    const finished_trip = await db_trip_api.checkFinishedTrip(req.user.ID);
    console.log(finished_trip.length + ', id: ' + req.user.ID);
    if (finished_trip.length<=0){
        req.flash('error_msg', 'There is no trip to rate for now.');
        res.redirect('/user');
        return;
    }
    // console.log(req.body);
    const {rate} = req.body;
    let errors = [];
    if (!rate){
        errors.push({
            message : 'Please give a valid rating'
        })
    }
    if (errors.length > 0){
        return res.render('layout.ejs', {
            title: 'Rate trip',
            body: 'user/rate_last',
            partials: '../partials/messages',
            formPostUrl: '/user/rate_last',
            footer: 'footer',
            cssFileLink: '/assets/css/rating.css',
            trips: finished_trip,
            errors
        })
    }

    let trip_id = finished_trip[0].ID;


    const update_trip = await db_trip_api.rateTrip(trip_id, rate);
    if (update_trip && update_trip.rowsAffected <= 0){
        req.flash('error_msg', 'Couldn\'t receive your feedback now. Please try again later')
        res.redirect('/user');
    }

    const driver_result = await db_trip_api.getDriver(trip_id);
    if (driver_result.length > 0){
        const rating_result =await db_driver_api.rateDriver(driver_result[0].DRIVER_ID, rate);
        if (rating_result && rating_result.rowsAffected>0){
            req.flash('success_msg', 'Your Feedback is much more appreciated')
            return res.redirect('/user')
        }
    }
    req.flash('error_msg', 'Couldn\'t receive your feedback now. Please try again later')
    res.redirect('/user');
})

module.exports = router;