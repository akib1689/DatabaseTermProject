// libraries
const express = require('express');

const router = express.Router({mergeParams : true});

const db_route_api = require('../../service/db_route_api')
const db_contains_api = require('../../service/db_contains_api')

router.get('/',async (req, res) => {
    const route_result = await db_route_api.getAllRoute();
    res.send(route_result);
})

router.get('/:id', async (req, res)=>{
    const route_result = await db_route_api.getRouteById(req.params.id);
    res.send(route_result);
})

router.get('/location/:id', async (req, res)=>{

    const loc_result = await db_contains_api.getAllLocationByRoute(req.params.id);
    res.send(loc_result);
})


module.exports = router;