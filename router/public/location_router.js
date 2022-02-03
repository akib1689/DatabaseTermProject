// libraries
const express = require('express');

const router = express.Router({mergeParams : true});

const db_loc_api = require('../../service/db_location_api')
const db_contains_api = require('../../service/db_contains_api')

router.get('/',async (req, res) => {
    const loc_result = await db_loc_api.getAllLocation();
    res.send(loc_result);
})
router.get('/:id', async (req, res)=>{
    const loc_result = await db_loc_api.getLocationById(req.params.id);
    res.send(loc_result);
})

router.get('/route/:id', async (req,res)=>{
    const route_result = await db_contains_api.getAllRoutesByLocation(req.params.id);
    res.send(route_result);
})

router.get('/destination/:id', async(req, res)=>{
    const result = await db_contains_api.getAllDestinationByLocation(req.params.id);
    res.send(result);
})
module.exports = router;