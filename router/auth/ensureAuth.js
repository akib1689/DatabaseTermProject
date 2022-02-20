function authenticated (req, res, next) {
    if (req.isAuthenticated()){
        return next();
    }

    req.flash('error_msg', 'Please log in to view this resource');
    res.redirect('/auth/login');
}

function authenticateAdmin (req, res, next){
    if (req.isAuthenticated() && req.user.ROLE === 'admin'){
        return next();
    }

    req.flash('error_msg', 'The resource is only available to system admin');
    res.redirect('/auth/login');
}

module.exports = {
    authenticated,
    authenticateAdmin
}