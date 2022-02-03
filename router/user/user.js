// libraries
const express = require('express');

const router = express.Router({mergeParams : true});


const db_api = require('../../service/db_location_api')

router.get('/', async (req, res) => {
    console.log("received request from user.js")
    res.send(`<h1>this is a response from user</h1>`)
});

router.get('/create_trip', async (req, res,) => {
    // get location
    const location_result = await db_api.getAllLocation();
    // console.log(location_result);

    // send location
    res.render('layout.ejs', {
        title: 'Create trip',
        body: 'user/create_trip_body',
        loc_result : location_result
    })
})

router.get('/for_testing', async (req, res)=>{

    res.render('layout.ejs',{
        title: 'batool_title',
        body: 'test',
        x : 'this is a variable',
        y : 100
    })
})


module.exports = router;