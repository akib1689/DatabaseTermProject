// libraries
const express = require('express');

const router = express.Router({mergeParams : true});
const db_bus_api = require('../../service/db_bus_api')

router.get('/:id',async (req, res) => {
    const query_result = await db_bus_api.getBus(req.params.id);
    let result
    if (query_result.length >0 ){
        result = {
            data : query_result[0]
        }
    }else {
        result = {
            data: null
        }
    }
    res.send(result)
})

router.get('/:id/dynamic_status', async (req, res)=>{
    const query_result = await db_bus_api.getBusDynamicStatus(req.params.id)

    let result
    if (query_result.length >0 ){
        result = {
            data : query_result[0]
        }
    }else {
        result = {
            data: null
        }
    }
    res.send(result)

})
module.exports = router;