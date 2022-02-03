// libraries
const express = require('express');

const router = express.Router({mergeParams : true});
const db_fare_api = require('../../service/db_fare_api')

router.get('/',async (req, res) => {

    let src = req.query.src
    let des = req.query.des
    let route = req.query.route

    const query_result = await db_fare_api.getFare(src,des,route)


    let result
    if (query_result.length >0){
        result = {
            fare : query_result[0].FARE
        }
    }else {
        result ={
            fare : -1
        }
    }
    
    res.send(result)
})
module.exports = router;