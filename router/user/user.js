// libraries
const express = require('express');

const router = express.Router({mergeParams: true});

const db_trip_api = require('../../service/db_trip_api')

router.get('/', async (req, res) => {
    res.render('layout.ejs', {
        title: 'User Home',
        body: 'user/user_home',
        partials: '../partials/messages'
    });
});

router.get('/create_trip', async (req, res,) => {
    // send location
    res.render('layout.ejs', {
        title: 'Create trip',
        body: 'user/create_trip_body',
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
            cssFileLink: '/assets/css/create_route_style.css'
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

    const insert_result = await db_trip_api.insertTrip(source, destination, bus, user.ID);
    if (insert_result && insert_result.rowsAffected > 0) {
        req.flash('success_msg', 'Successfully created a trip. Have a great Day!')
        res.redirect('/user');
        return;
    }

    req.flash('error_msg', 'Can\'t create trip now. Try again later')
    res.redirect('/user');


})


module.exports = router;