// libraries
const express = require('express');

const router = express.Router({mergeParams: true});


const db_bus_api = require('../../service/db_bus_api');
const db_driver_api = require('../../service/db_driver_api')
const db_requested_api = require('../../service/db_requested_api')

//utils
const time = require("../../utils/time");

router.get('/', async (req, res) => {
    res.render('layout.ejs', {
        title: 'Driver Home',
        body: 'driver/driver_home',
        partials: '../partials/messages'
    });
})

router.get('/req_bus', async (req, res) =>{
    const bus_not_assigned = await db_bus_api.getBusNotAssignedToday();
    res.render('layout.ejs', {
        title: 'Driver Home',
        body: 'driver/req_bus',
        partials: '../partials/messages',
        formPostUrl: '/driver/req_bus',
        cssFileLink: '/assets/css/create_route_style.css',
        buses : bus_not_assigned
    });
})

router.post('/req_bus', async (req, res) =>{
    const bus_not_assigned = await db_bus_api.getBusNotAssignedToday();
    // console.log(req.body);
    const {bus_id, num_days} = req.body;
    const driver_id = req.user.ID;
    let errors = [];
    if (!bus_id || ! num_days ){
        errors.push({
            message : 'Please fill up the form'
        })
    }

    if (isNaN(bus_id) || isNaN(num_days)) {
        errors.push({
            message: 'Bus ID must be numbers'
        })
    }

    if (errors.length > 0){
        // didn't pass the form
        res.render('layout.ejs', {
            title: 'Driver Home',
            body: 'driver/req_bus',
            partials: '../partials/messages',
            formPostUrl: '/driver/req_bus',
            cssFileLink: '/assets/css/create_route_style.css',
            buses : bus_not_assigned,
            errors
        })
    }else{
        // passed the form

        const date = time.get_date();
        for (let i = 0; i < num_days; i++) {
            const insert_result = await db_requested_api.insertRequest(bus_id,driver_id, date, i);
            if (!insert_result || insert_result.rowsAffected <= 0){
                req.flash('error_msg', 'The bus is already assigned driver in the following date')
                res.redirect('/driver')
                return;
            }
        }
        let msg = 'Successfully requested the bus ' + bus_id
            + ' for the next ' + num_days + ' days!'
        req.flash('success_msg', msg)
        res.redirect('/driver')
    }
});
router.get('/bus_position', async (req, res)=>{
    const busses = await db_driver_api.getBusByUser(req.user.ID);
    res.render('layout.ejs', {
        title: 'Update bus Location',
        body: 'driver/update_bus_loc',
        partials: '../partials/messages',
        formPostUrl: '/driver/bus_position',
        cssFileLink: '/assets/css/create_route_style.css',
        busses
    });
})

router.post('/bus_position', async (req, res)=>{
    const busses = await db_driver_api.getBusByUser(req.user.ID);
    console.log(req.body)
    const {bus_id, x_coordinate, y_coordinate} = req.body;
    let errors = [];
    if (!bus_id || !x_coordinate || !y_coordinate){
        errors.push({
            message : 'Please fill the form'
        })
    }
    if (busses.ID !== bus_id){
        errors.push({
            message : 'You don\'t have the permission to edit the location of the following bus'
        })
    }
    if (errors.length > 0){
        res.render('layout.ejs', {
            title: 'Update bus Location',
            body: 'driver/update_bus_loc',
            partials: '../partials/messages',
            formPostUrl: '/driver/bus_position',
            cssFileLink: '/assets/css/create_route_style.css',
            busses
        });
    }else{

    }
})


module.exports = router;