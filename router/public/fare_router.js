// libraries
const express = require('express');

const router = express.Router({mergeParams : true});
const db_fare_api = require('../../service/db_fare_api')

router.get('/',async (req, res) => {

    let src = req.query.src
    let des = req.query.des
    let route = req.query.route
    let query_result
    if (typeof (route) != 'undefined'){
        query_result = await db_fare_api.getFare(src,des,route);
    }else {
        console.log('present')
        query_result = await db_fare_api.getSrcDesFare(src, des);
    }


    let result
    if (query_result.length >0){
        result = {
            data : query_result
        }
    }else {
        result ={
            data : []
        }
    }
    
    res.send(result)
})
module.exports = router;