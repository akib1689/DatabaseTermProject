// libraries
const express = require('express');

const router = express.Router({mergeParams : true});


const db_location_api = require('../../service/db_location_api')
const db_route_api = require('../../service/db_route_api')
const e = require("express");

router.get('/', async (req, res) => {
    res.render('layout.ejs', {
        title: 'Admin Home',
        body: 'admin/admin_body',
        partials: '../partials/messages'
    });
});

//renders the create_location page
router.get('/create_location', async (req, res) =>{
    res.render('layout.ejs', {
        title: 'Create Location',
        body: 'admin/create_location',
        formPostUrl: '/admin/create_location'
    });
})

router.post('/create_location', async (req, res)=>{
    const {param} = req.body;
    let errors = [];

    if (!param){
        errors.push({
            message: 'Please fill in the form'
        })
    }

    if (errors.length > 0){
        res.render('layout.ejs', {
            title: 'Create Location',
            body: 'admin/create_page',
            partials: '../partials/messages',
            formPostUrl: '/admin/create_location',
            errors
        })
    }else{
        const query_result  = await db_location_api.getLocationByName(param);
        if (query_result.length > 0){
            errors.push({
                message : 'Location present in database'
            })
            res.render('layout.ejs', {
                title: 'Create Location',
                body: 'admin/create_page',
                partials: '../partials/messages',
                formPostUrl: '/admin/create_location',
                errors
            })
        }else{
            const insert_result = await db_location_api.insertLocation(param)
            if (insert_result.rowsAffected > 0){
                req.flash('success_msg', 'Location created successfully!')
                res.redirect('/admin')
            }else {
                errors.push({
                    message : 'Some internal database error occurred'
                })
                res.render('layout.ejs', {
                    title: 'Create Location',
                    body: 'admin/create_page',
                    partials: '../partials/messages',
                    formPostUrl: '/admin/create_location',
                    errors
                })
            }
        }
    }
})

router.get('/create_route', async (req, res) =>{
    res.render('layout.ejs', {
        title: 'Create Route',
        body: 'admin/create_page',
        formPostUrl: '/admin/create_route',
        scripts: '/assets/js/route.js'
    });
})

router.post('/create_route', async (req, res)=>{
    const {param} = req.body;
    console.log(req.body)
    let errors = [];
    if (!param){
        errors.push({
            message: 'Please fill in the form'
        })
    }
    if (errors.length > 0){
        res.render('layout.ejs', {
            title: 'Create Route',
            body: 'admin/create_page',
            partials: '../partials/messages',
            pageTitle: 'Create Route',
            formPostUrl: '/admin/create_route',
            scripts: '/assets/js/route.js',
            errors
        })
    }else{
        const query_result  = await db_route_api.getRouteByName(param);
        if (query_result.length > 0){
            errors.push({
                message : 'Route present in database'
            })
            res.render('layout.ejs', {
                title: 'Create Route',
                body: 'admin/create_page',
                partials: '../partials/messages',
                pageTitle: 'Create Route',
                formPostUrl: '/admin/create_route',
                scripts: '/assets/js/route.js',
                errors
            })
        }else{
            const insert_result = await db_route_api.insertRoute(param)
            if (insert_result.rowsAffected > 0){
                req.flash('success_msg', 'Route created successfully!')
                res.redirect('/admin')
            }else {
                errors.push({
                    message : 'Some internal database error occurred'
                })
                res.render('layout.ejs', {
                    title: 'Create Location',
                    body: 'admin/create_page',
                    partials: '../partials/messages',
                    pageTitle: 'Create Location',
                    formPostUrl: '/admin/create_location',
                    scripts: '/assets/js/route.js',
                    errors
                })
            }
        }
    }
})


module.exports = router;