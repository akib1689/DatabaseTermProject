
// libraries
const express = require('express');

const router = express.Router({mergeParams : true});

router.get('/login',(req, res)=>{
    res.render('layout.ejs', {
        title: 'Login',
        body : 'auth/login'
    });
})
router.get('/register',(req, res)=>{
    res.render('layout.ejs', {
        title: 'Bus Management System',
        body : 'auth/register'
    });
})

router.post('/register', (req, res)=>{
    console.log(req.body)
    res.send(req.body)
})

router.post('/login', (req, res)=>{
    console.log(req.body)
    res.send(req.body)
})
module.exports = router;