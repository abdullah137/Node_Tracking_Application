module.exports = {
    ensureAuthenticated: function(req, res, next) {
        if(req.isAuthenticated()) {
            return next();
        }
    
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