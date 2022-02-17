// libraries
const express = require('express');
const bcrypt = require('bcryptjs')
const passport = require('passport')

const router = express.Router({mergeParams: true});

const db_person_api = require('../../service/db_person_api')
const db_company_api = require('../../service/db_company_api')
const db_owner_api = require('../../service/db_owner-api')

router.get('/register', (req, res) => {
    res.render('layout.ejs', {
        title: 'Register',
        body: 'auth/register',
        partials: '../partials/messages',
        formPostUrl: '/auth/register'
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

    if (phoneNumber.length !== 11) {
        errors.push({
            message: 'Phone number must be of 11 characters'
        })
    }


    if (errors.length > 0) {
        console.log(errors)
        res.render('layout.ejs', {
            title: 'Register',
            body: 'auth/register',
            partials: '../partials/messages',
            formPostUrl: '/auth/register',
            errors,
            name,
            email: phoneNumber,
            password,
            password2
        })
    } else {
        // passed the form


        const query_result = await db_person_api.findUserByPhone(phoneNumber)

        if (query_result.length > 0) {

            //user already exists
            errors.push({
                message: 'The mobile number is present in database'
            })

            res.render('layout.ejs', {
                title: 'Register',
                body: 'auth/register',
                partials: '../partials/messages',
                formPostUrl: '/auth/register',
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

            const insert_result = await db_person_api.insertUser(name, phoneNumber, hashedPass)

            if (insert_result.rowsAffected > 0) {
                req.flash('success_msg', 'Registered user! Login to view the page')
                res.redirect('/auth/login')
            } else {
                errors.push({
                    message: 'Some internal server error occurred'
                })
                res.render('layout.ejs', {
                    title: 'Register',
                    body: 'auth/register',
                    partials: '../partials/messages',
                    formPostUrl: '/auth/register',
                    errors,
                    name,
                    email: phoneNumber,
                    password,
                    password2
                })
            }

        }
    }
})


router.get('/register_admin', (req, res) => {
    res.render('layout.ejs', {
        title: 'Register',
        body: 'auth/register',
        partials: '../partials/messages',
        formPostUrl: '/auth/register_admin'
    });
})

router.post('/register_admin', async (req, res) => {
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

    if (phoneNumber.length !== 11) {
        errors.push({
            message: 'Phone number must be of 11 characters'
        })
    }


    if (errors.length > 0) {
        console.log(errors)
        res.render('layout.ejs', {
            title: 'Register',
            body: 'auth/register',
            partials: '../partials/messages',
            formPostUrl: '/auth/register_admin',
            errors,
            name,
            email: phoneNumber,
            password,
            password2
        })
    } else {
        // passed the form


        const query_result = await db_person_api.findUserByPhone(phoneNumber)

        if (query_result.length > 0) {

            //user already exists
            errors.push({
                message: 'The mobile number is present in database'
            })

            res.render('layout.ejs', {
                title: 'Register',
                body: 'auth/register',
                partials: '../partials/messages',
                formPostUrl: '/auth/register_admin',
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

            const insert_result = await db_person_api.insertAdmin(name, phoneNumber, hashedPass)

            if (insert_result.rowsAffected > 0) {
                req.flash('success_msg', 'Registered user! Login to view the page')
                res.redirect('/auth/login')
            } else {
                errors.push({
                    message: 'Some internal server error occurred'
                })
                res.render('layout.ejs', {
                    title: 'Register',
                    body: 'auth/register',
                    partials: '../partials/messages',
                    formPostUrl: '/auth/register_admin',
                    errors,
                    name,
                    email: phoneNumber,
                    password,
                    password2
                })
            }

        }
    }
})


router.get('/register_company', (req, res) => {
    res.render('layout.ejs', {
        title: 'Register',
        body: 'auth/register',
        partials: '../partials/messages',
        formPostUrl: '/auth/register_company'
    });
})

router.post('/register_company', async (req, res) => {
    const {name, phone_number: phoneNumber, password, password2, company} = req.body;
    let errors = [];

    if (!name || !phoneNumber || !password || !password2 || !company) {
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

    if (phoneNumber.length !== 11) {
        errors.push({
            message: 'Phone number must be of 11 characters'
        })
    }


    if (errors.length > 0) {
        console.log(errors)
        res.render('layout.ejs', {
            title: 'Register',
            body: 'auth/register',
            partials: '../partials/messages',
            formPostUrl: '/auth/register_company',
            errors,
            name,
            email: phoneNumber,
            password,
            password2
        })
    } else {
        // passed the form


        const query_result = await db_person_api.findUserByPhone(phoneNumber)

        if (query_result.length > 0) {

            //user already exists
            errors.push({
                message: 'The mobile number is present in database'
            })

            res.render('layout.ejs', {
                title: 'Register',
                body: 'auth/register',
                partials: '../partials/messages',
                formPostUrl: '/auth/register_company',
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

            const person_entries = await db_person_api.insertCompanyOwner(name, phoneNumber, hashedPass)
            console.log(person_entries);
            if (person_entries.p_id.length > 0) {
                // insert into company
                const person_id = person_entries.p_id[0];
                const company_entries = await db_company_api.insertCompany(company)

                if (company_entries.c_id.length > 0){
                    // link the two
                    const company_id = company_entries.c_id[0];
                    const insert_result = await db_owner_api.insertOwner(person_id, company_id);
                    if (insert_result.rowsAffected > 0){
                        req.flash('success_msg', 'Registered user! Login to view the page')
                        res.redirect('/auth/login')
                    }else {
                        errors.push({
                            message : 'Some internal server error occurred'
                        })
                    }

                }else {
                    errors.push({
                        message: 'Some internal server error occurred'
                    })
                }
            } else {
                errors.push({
                    message: 'Some internal server error occurred'
                })
            }

            if (errors.length > 0){
                res.render('layout.ejs', {
                    title: 'Register',
                    body: 'auth/register',
                    partials: '../partials/messages',
                    formPostUrl: '/auth/register_company',
                    errors,
                    name,
                    email: phoneNumber,
                    password,
                    password2
                })
            }
        }
    }
})


router.get('/login', (req, res) => {
    res.render('layout.ejs', {
        title: 'Login',
        body: 'auth/login',
        partials: '../partials/messages'
    });
})

router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/user',
        failureRedirect: '/auth/login',
        failureFlash: true
    })(req, res, next);
})


router.get('/logout', ((req, res) => {
    req.logout();
    req.flash('success_msg', 'You\'re successfully Logged out')
    res.redirect('/auth/login')
}))

module.exports = router;