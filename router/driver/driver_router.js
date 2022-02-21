// libraries
const express = require('express');

const router = express.Router({mergeParams: true});

const db_owner_api = require('../../service/db_owner-api');
const db_bus_api = require('../../service/db_bus_api');
const db_route_api = require('../../service/db_route_api');
const db_operates_api = require('../../service/db_operates_api');

router.get('/', async (req, res) => {
    res.render('layout.ejs', {
        title: 'Driver Home',
        body: 'driver/driver_home',
        partials: '../partials/messages'
    });
})


module.exports = router;