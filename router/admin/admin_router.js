// libraries
const express = require('express');

const router = express.Router({mergeParams: true});


const db_location_api = require('../../service/db_location_api')
const db_route_api = require('../../service/db_route_api')
const db_contains_api = require('../../service/db_contains_api')
const db_fare_api = require('../../service/db_fare_api')
const db_company_api = require('../../service/db_company_api')

const e = require("express");

router.get('/', async (req, res) => {
    res.render('layout.ejs', {
        title: 'Admin Home',
        body: 'admin/admin_body',
        partials: '../partials/messages'
    });
});

//renders the create_location page
router.get('/create_location', async (req, res) => {
    res.render('layout.ejs', {
        title: 'Create Location',
        body: 'admin/create_location',
        formPostUrl: '/admin/create_location'
    });
})

router.post('/create_location', async (req, res) => {
    const {param} = req.body;
    let errors = [];

    if (!param) {
        errors.push({
            message: 'Please fill in the form'
        })
    }

    if (errors.length > 0) {
        res.render('layout.ejs', {
            title: 'Create Location',
            body: 'admin/create_location',
            partials: '../partials/messages',
            formPostUrl: '/admin/create_location',
            errors
        })
    } else {
        const query_result = await db_location_api.getLocationByName(param);
        if (query_result.length > 0) {
            errors.push({
                message: 'Location present in database'
            })
            res.render('layout.ejs', {
                title: 'Create Location',
                body: 'admin/create_location',
                partials: '../partials/messages',
                formPostUrl: '/admin/create_location',
                errors
            })
        } else {
            const insert_result = await db_location_api.insertLocation(param)
            if (insert_result.rowsAffected > 0) {
                req.flash('success_msg', 'Location created successfully!')
                res.redirect('/admin')
            } else {
                errors.push({
                    message: 'Some internal database error occurred'
                })
                res.render('layout.ejs', {
                    title: 'Create Location',
                    body: 'admin/create_location',
                    partials: '../partials/messages',
                    formPostUrl: '/admin/create_location',
                    errors
                })
            }
        }
    }
})

router.get('/create_route', async (req, res) => {
    res.render('layout.ejs', {
        title: 'Create Route',
        body: 'admin/create_page',
        formPostUrl: '/admin/create_route',
        scripts: '/assets/js/route.js',
        cssFileLink: '/assets/css/create_route_style.css'
    });
})

router.post('/create_route', async (req, res) => {
    const {param, loc_id, fares} = req.body;
    // console.log(req.body)
    let errors = [];
    if (!param || !loc_id || !fares) {
        errors.push({
            message: 'Please fill in the form'
        })
    }

    if (!Array.isArray(loc_id) || !Array.isArray(fares)) {
        errors.push({
            message: 'Route consists of minimum 3 location'
        })
    }

    if (errors.length > 0) {
        res.render('layout.ejs', {
            title: 'Create Route',
            body: 'admin/create_page',
            partials: '../partials/messages',
            pageTitle: 'Create Route',
            formPostUrl: '/admin/create_route',
            scripts: '/assets/js/route.js',
            cssFileLink: '/assets/css/create_route_style.css',
            errors
        })
    } else {
        const query_result = await db_route_api.getRouteByName(param);
        if (query_result.length > 0) {
            errors.push({
                message: 'Route present in database'
            })
            res.render('layout.ejs', {
                title: 'Create Route',
                body: 'admin/create_page',
                partials: '../partials/messages',
                pageTitle: 'Create Route',
                formPostUrl: '/admin/create_route',
                scripts: '/assets/js/route.js',
                cssFileLink: '/assets/css/create_route_style.css',
                errors
            })
        } else {
            const insert_result = await db_route_api.insertRoute(param)
            if (insert_result.rowsAffected > 0) {
                const route_result = await db_route_api.getRouteByName(param)
                const new_route = route_result[0];
                let counter = 0;
                for (let i = 0; i < loc_id.length; i++) {
                    // push the location to database contains table
                    const insert_contains = await db_contains_api.insertInContains(new_route.ID, loc_id[i])
                    if (insert_contains.rowsAffected > 0) {
                        for (let j = 0; j < i; j++) {
                            // counter has the index of the fare
                            // i, j is the route id of the position
                            const insert_fare = await db_fare_api.insertFare(new_route.ID, loc_id[i], loc_id[j], fares[counter])
                            if (insert_fare.rowsAffected <= 0) {
                                req.flash('error_msg', 'Some internal Database error occurred')
                                res.redirect('/admin')
                                return;
                            }
                            counter++;
                        }
                    } else {
                        req.flash('error_msg', 'Some internal Database error occurred')
                        res.redirect('/admin')
                        return
                    }
                }

                req.flash('success_msg', 'Route created successfully!')
                res.redirect('/admin')

            } else {
                errors.push({
                    message: 'Some internal database error occurred'
                })
                res.render('layout.ejs', {
                    title: 'Create Location',
                    body: 'admin/create_page',
                    partials: '../partials/messages',
                    pageTitle: 'Create Location',
                    formPostUrl: '/admin/create_location',
                    scripts: '/assets/js/route.js',
                    cssFileLink: '/assets/css/create_route_style.css',
                    errors
                })
            }
        }
    }
})

router.get('/approve_company', async (req, res) => {
    const companies = await db_company_api.getNotApprovedCompany();
    // console.log(companies);
    res.render('layout.ejs', {
        title: 'Approve Company',
        body: 'admin/approve_company',
        formPostUrl: '/admin/approve_company',
        cssFileLink: '/assets/css/company.css',
        companies
    });
})

router.post('/approve_company', async (req, res) => {
    const companies = await db_company_api.getNotApprovedCompany();
    console.log(req.body);
    const {param} = req.body;
    let errors = [];
    if (!param) {
        errors.push({
            message: 'Please fill in the form'
        })
    }

    if (isNaN(param)) {
        errors.push({
            message: 'Please input the id of the company'
        })
    }

    if (errors.length > 0) {
        res.render('layout.ejs', {
            title: 'Approve Company',
            body: 'admin/approve_company',
            partials: '../partials/messages',
            formPostUrl: '/admin/approve_company',
            cssFileLink: '/assets/css/company.css',
            errors,
            companies
        })
    } else {
        const update_result = await db_company_api.approveCompany(param);
        if (update_result.rowsAffected > 0) {
            // the update was successful
            req.flash('success_msg', 'Successfully Approved the company...')
            res.redirect('/admin')
        } else {
            errors.push({
                message: 'There is no company against the ID you typed'
            })

            res.render('layout.ejs', {
                title: 'Approve Company',
                body: 'admin/approve_company',
                partials: '../partials/messages',
                formPostUrl: '/admin/approve_company',
                cssFileLink: '/assets/css/company.css',
                errors,
                companies
            })
        }
    }
})

router.get('/update_route', async (req, res) => {
    const route_list = await db_route_api.getAllRoute();


    res.render('layout.ejs', {
        title: 'Update Route',
        body: 'admin/update_route',
        formPostUrl: '/admin/update_route',
        scripts: '/assets/js/update_route.js',
        cssFileLink: '/assets/css/create_route_style.css',
        routes: route_list
    });
})

router.post('/update_route', async (req, res) => {
    const route_list = await db_route_api.getAllRoute();
    const {param, loc_id, fares} = req.body;
    let errors = [];
    if (!param || !loc_id || !fares) {
        errors.push({
            message: 'Please fill in the form'
        })
    }

    if (!Array.isArray(loc_id) || !Array.isArray(fares)) {
        errors.push({
            message: 'Fare are tempered'
        })
    }

    if (errors.length > 0) {
        res.render('layout.ejs', {
            title: 'Update Route',
            body: 'admin/update_route',
            partials: '../partials/messages',
            pageTitle: 'Update Route',
            formPostUrl: '/admin/update_route',
            scripts: '/assets/js/update_route.js',
            cssFileLink: '/assets/css/create_route_style.css',
            errors,
            routes: route_list
        })
    } else {
        const query_result = await db_route_api.getRouteById(param);
        if (query_result.length === 0) {
            errors.push({
                message: 'Route not present in database'
            })
            res.render('layout.ejs', {
                title: 'Update Route',
                body: 'admin/update_page',
                partials: '../partials/messages',
                pageTitle: 'Update Route',
                formPostUrl: '/admin/update_route',
                scripts: '/assets/js/update_route.js',
                cssFileLink: '/assets/css/create_route_style.css',
                errors,
                routes: route_list
            })
        } else {
            let counter = 0;
            for (let i = 0; i < loc_id.length; i++) {
                for (let j = 0; j < i; j++) {
                    await db_fare_api.updateFare(param, loc_id[i], loc_id[j], fares[counter]);
                    counter ++;
                }
            }
            req.flash('success_msg', 'Route updated successfully!')
            res.redirect('/admin')
        }
    }
})
module.exports = router;