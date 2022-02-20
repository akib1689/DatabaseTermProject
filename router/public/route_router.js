// libraries
const express = require('express');

const router = express.Router({mergeParams : true});

const db_route_api = require('../../service/db_route_api')
const db_contains_api = require('../../service/db_contains_api')
const db_operates_api = require('../../service/db_operates_api')
const db_fare_api = require('../../service/db_fare_api')

router.get('/',async (req, res) => {
    const query_result = await db_route_api.getAllRoute();
    const result = {
        data : query_result
    }
    res.send(result);
})

router.get('/:id', async (req, res)=>{
    const query_result = await db_route_api.getRouteById(req.params.id);

    let result
    if (query_result.length > 0) {
        result = {
            data: query_result[0]
        }
    }else {
        result = {
            data: null
        }
    }

    res.send(result);
})

//get all the location of a route
router.get('/:id/location', async (req, res)=>{

    const query_result = await db_contains_api.getAllLocationByRoute(req.params.id);
    const result = {
        data: query_result
    }
    res.send(result);
})

//get all bus running in route in today
router.get('/:id/bus' , async(req, res)=>{
    if (req.query.date){
        const query_result = await db_operates_api.getBusInDate(req.params.id, req.query.date);

        const result = {
            data : query_result
        }

        res.send(result)
    }else{
        const query_result = await db_operates_api.getBusInRoute(req.params.id);

        const result = {
            data : query_result
        }

        res.send(result)
    }

} )
router.get('/:id/fare', async (req, res)=>{

    const query_result = await db_fare_api.getRouteFare(req.params.id);
    const result = {
        data: query_result
    }
    res.send(result);
})

module.exports = router;