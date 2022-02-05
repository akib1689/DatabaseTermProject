const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs')

const db_person_api = require('../service/db_person_api')

 function validate(passport){
    passport.use(
        new LocalStrategy({
            usernameField: 'phone_number'
        }, async (phone_number, password, done) =>{
            const query_result  = await db_person_api.findUserByPhone(phone_number);
            if (query_result.length > 0){
                const user = query_result[0];

                bcrypt.compare(password, user.PASSWORD, ((error, match) => {
                    if (match){
                        console.log('password match')
                        return done(null, user);
                    }else {
                        console.log('password not match')
                        return done(null, false, {
                            message : "Password doesn't match"
                        })
                    }
                }))
            }else {
                return done(null, false, {
                    message : 'Phone number is not registered'
                })
            }
        })
    );

    passport.serializeUser(function(user, done) {
        done(null, user.ID);
    });

    passport.deserializeUser(async function(id, done) {
        /*User.findById(id, function (err, user) {
            done(err, user);
        });*/
        const query_result = await db_person_api.findUserById(id);
        if (query_result.length > 0){
            done(null, query_result[0])
        }else {
            done(null, false)
        }
    });
}

module.exports = {
    validate
}