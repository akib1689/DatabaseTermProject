// libraries
const express = require('express');

const router = express.Router({mergeParams : true});

const db_route_api = require('../../service/db_route_api')
const db_contains_api = require('../../service/db_contains_api')

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

router.get('/location/:id', async (req, res)=>{

    const query_result = await db_contains_api.getAllLocationByRoute(req.params.id);
    const result = {
        data: query_result
    }
    res.send(result);
})


module.exports = router;