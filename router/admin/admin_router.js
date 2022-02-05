// libraries
const express = require('express');

const router = express.Router({mergeParams : true});


const db_location_api = require('../../service/db_location_api')
const e = require("express");

router.get('/', async (req, res) => {
    console.log("received request from admin.js")
    res.send(`<h1>this is a response from admin</h1>`)
});

//renders the create_location page
router.get('/create_location', async (req, res) =>{
    res.render('layout.ejs', {
        title: 'Create Location',
        body: 'admin/create_location'
    });
})

router.post('/create_location', async (req, res)=>{
    const {loc_name} = req.body;
    let errors = [];

    if (!loc_name){
        errors.push({
            message: 'Please fill in the form'
        })
    }

    if (errors.length > 0){
        res.render('layout.ejs', {
            title: 'Create Location',
            body: 'admin/create_location',
            partials: '../partials/messages',
            errors
        })
    }else{
        const query_result  = await db_location_api.getLocationByName(loc_name);
        if (query_result.length > 0){
            errors.push({
                message : 'Location present in database'
            })
            res.render('layout.ejs', {
                title: 'Create Location',
                body: 'admin/create_location',
                partials: '../partials/messages',
                errors
            })
        }else{
            const insert_result = await db_location_api.insertLocation(loc_name)
            if (insert_result.rowsAffected > 0){
                req.flash('success_msg', 'Registered user! Login to view the page')
                res.redirect('/admin')
            }else {
                errors.push({
                    message : 'Some internal database occurred'
                })
                res.render('layout.ejs', {
                    title: 'Create Location',
                    body: 'admin/create_location',
                    partials: '../partials/messages',
                    errors
                })
            }
        }
    }
})


module.exports = router;