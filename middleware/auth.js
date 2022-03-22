module.exports = {
    ensureAuthenticated: function(req, res, next) {
        if(req.isAuthenticated()) {
            return next();
        }
<<<<<<< HEAD
    
=======
>>>>>>> 4742f51affda7f4638661629ec91c40ef792f10b
        req.flash("error_msg", "Please log in to view that resourse ");
        res.redirect("/signin");
    },
    forwardAuthenticated: function(req, res, next) {
        if(!req.isAuthenticated()) {
            return next();
        }
        res.redirect("/user/dashboard");
    }
}