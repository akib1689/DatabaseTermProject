// libraries
const express = require('express');

const router = express.Router({mergeParams: true});
// db class
const db_owner_api = require('../../service/db_owner-api');
const db_bus_api = require('../../service/db_bus_api');
const db_route_api = require('../../service/db_route_api');
const db_operates_api = require('../../service/db_operates_api');

//utils
const time = require('../../utils/time')

router.get('/', async (req, res) => {
    res.render('layout.ejs', {
        title: 'Company Home',
        body: 'company/company_home',
        partials: '../partials/messages'
    });
})

router.get('/add_bus', async (req, res) => {
    res.render('layout.ejs', {
        title: 'Add bus',
        body: 'company/register_bus',
        partials: '../partials/messages',
        formPostUrl: '/company/add_bus',
        cssFileLink: '/assets/css/create_route_style.css'
    })
})

router.post('/add_bus', async (req, res) => {
    console.log(req.body)
    const {param, capacity} = req.body;
    let errors = [];
    if (!param || !capacity) {
        errors.push({
            message: 'Please fill up the form'
        })
    }

    if (capacity > 99) {
        errors.push({
            message: 'Capacity of a bus can\'t be greater than 99'
        })
    }

    if (errors.length > 0) {
        res.render('layout.ejs', {
            title: 'Add bus',
            body: 'company/register_bus',
            partials: '../partials/messages',
            formPostUrl: '/company/add_bus',
            cssFileLink: '/assets/css/create_route_style.css',
            errors
        })
    } else {
        // find the company of the user that logged in
        const user_company = await db_owner_api.getCompany(req.user.ID);
        if (user_company.length !== 1) {
            req.flash('error_msg', 'Couldn\'t create bus. Try again later')
            res.redirect('/company')
        } else {
            const row = user_company[0];
            const insert_result = await db_bus_api.insertBus(param, capacity, row.C_ID);
            if (insert_result.rowsAffected > 0) {
                req.flash('success_msg', 'Added a bus to the company!!');
                res.redirect('/company');
            } else {
                req.flash('error_msg', 'Couldn\'t create bus. Try again later')
                res.redirect('/company')
            }
        }
    }
})

router.get('/schedule_bus', async (req, res) => {
    // find the company of the user
    const user_company = await db_owner_api.getCompany(req.user.ID);
    if (user_company.length > 0) {
        const company_bus = await db_bus_api.getCompanyBus(user_company[0].C_ID);
        const routes = await db_route_api.getAllRoute();
        let timeString = time.get_date();

        res.render('layout.ejs', {
            title: 'Add bus',
            body: 'company/schedule_bus',
            partials: '../partials/messages',
            formPostUrl: '/company/schedule_bus',
            cssFileLink: '/assets/css/create_route_style.css',
            buses: company_bus,
            routes,
            minDate: timeString
        })
    } else {
        // some error occurred the user is not a company admin
        req.flash('error_msg', 'Couldn\'t create the schedule bus at this moment! Try again later');
        res.redirect('/company');
    }
})

router.post('/schedule_bus', async (req, res) => {
    // console.log(req.body);
    const user_company = await db_owner_api.getCompany(req.user.ID);
    if (user_company.length > 0) {
        const company_bus = await db_bus_api.getCompanyBus(user_company[0].C_ID);
        const routes = await db_route_api.getAllRoute();
        let timeString = time.get_date();

        let errors = [];
        const {bus_id, route_id, operation_date, num_days} = req.body;
        if (!bus_id || !route_id || !operation_date || !num_days) {
            errors.push({
                message: 'Please fill in the form'
            })
        }

        if (isNaN(bus_id) || isNaN(route_id)) {
            errors.push({
                message: 'Bus ID and Route ID must be numbers'
            })
        }
        if (errors.length > 0) {
            // didn't pass the form
            res.render('layout.ejs', {
                title: 'Add bus',
                body: 'company/schedule_bus',
                partials: '../partials/messages',
                formPostUrl: '/company/schedule_bus',
                cssFileLink: '/assets/css/create_route_style.css',
                buses: company_bus,
                routes,
                minDate: timeString
            })
        } else {
            // passed the form
            for (let i = 0; i < num_days; i++) {
                const insert_result = await db_operates_api.insertOperation(bus_id,route_id, operation_date, i);
                if (!insert_result || insert_result.rowsAffected <= 0){
                    req.flash('error_msg', 'The bus is already assigned to a route in the following date')
                    res.redirect('/company')
                    return;
                }
            }
            let msg = 'Successfully assigned the bus ' + bus_id
                + ' to the route ' + route_id +
                ' for the next ' + num_days + ' days!'
            req.flash('success_msg', msg)
            res.redirect('/company')

        }
    } else {
        // some error occurred the user is not a company admin
        req.flash('error_msg', 'Couldn\'t create the schedule bus at this moment! Try again later');
        res.redirect('/company');
    }

})

module.exports = router;