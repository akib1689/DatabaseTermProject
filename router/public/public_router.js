// libraries
const express = require('express');

const router = express.Router({mergeParams : true});

const loc_router = require('./location_router')
const route_router = require('./route_router')
router.get('/', (req, res)=>{
    res.send('<h1>received from public router</h1>')
})

router.use('/location', loc_router);
router.use('/route', route_router);

module.exports = router;