// libraries
const express = require('express');

const router = express.Router({mergeParams : true});

router.get('/', async (req, res)=>{
    res.render('layout.ejs', {
        title: 'Company Home',
        body: 'company/company_home',
        partials: '../partials/messages'
    });
})
module.exports = router;