// libraries
const express = require('express');
const bcrypt = require('bcryptjs')
const passport = require('passport')

const router = express.Router({mergeParams: true});

const dp_person_api = require('../../service/db_person_api')

router.get('/login', (req, res) => {

    res.render('layout.ejs', {
        title: 'Login',
        body: 'auth/login',
        partials: 'partials/messages'
    });
})
router.get('/register', (req, res) => {
    res.render('layout.ejs', {
        title: 'Register',
        body: 'auth/register',
        partials: 'partials/messages'
    });
})

router.post('/register', async (req, res) => {
    const {name, phone_number: phoneNumber, password, password2} = req.body;
    // console.log(req.body)
    let errors = [];


    if (!name || !phoneNumber || !password || !password2) {
        errors.push({
            message: 'Please fill in the form'
        })
    }

    if (password !== password2) {
        errors.push({
            message: 'Passwords don\'t match'
        })
    }

    if (password && password.length < 6) {
        errors.push({
            message: 'Passwords should be at least 6 characters'
        })
    }

    if (phoneNumber.length !== 11){
        errors.push({
            message : 'Phone number must be of 11 characters'
        })
    }


    if (errors.length > 0) {
        console.log(errors)
        res.render('layout.ejs', {
            title: 'Register',
            body: 'auth/register',
            partials: 'partials/messages',
            errors,
            name,
            email: phoneNumber,
            password,
            password2
        })
    } else {
        // passed the form


        const query_result = await dp_person_api.findUserByPhone(phoneNumber)

        if (query_result.length > 0) {

            //user already exists
            errors.push({
                message: 'The mobile number is present in database'
            })

            res.render('layout.ejs', {
                title: 'Register',
                body: 'auth/register',
                partials: 'partials/messages',
                errors,
                name,
                email: phoneNumber,
                password,
                password2
            })
        } else {
            // hash password
            let salt = bcrypt.genSaltSync(10);
            let hashedPass = bcrypt.hashSync(password, salt);

            const insert_result = await dp_person_api.insertUser(name, phoneNumber, hashedPass)

            if (insert_result.rowsAffected > 0) {
                req.flash('success_msg', 'Registered user! Login to view the page')
                res.redirect('/auth/login')
            } else {
                res.send('some error occurred')
            }

        }

    }


})

router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect : '/user',
        failureRedirect : '/auth/login',
        failureFlash : true
    })(req, res, next);
})

router.get('/logout', ((req, res) => {
    req.logout();
    req.flash('success_msg', 'You\'re successfully Logged out')
    res.redirect('/auth/login')
}))

module.exports = router;