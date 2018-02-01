const express         = require("express");
const router          = express.Router();
const passport        = require("passport");
const User            = require("../models/user");


// ROOT ROUTE
router.get("/", function(req, res){
    res.render("landing");
});

// ============
// AUTH ROUTES
// ============

// show register form
router.get("/register", function(req, res) {
    res.render("register");
});

// handle sign up logic
router.post("/register", function(req, res) {
    const newUser = new User({username: req.body.username, email: req.body.email});

    User.register(newUser, req.body.password, function(err, user){
       if(err){
           req.flash("error", err.message);
           
           return res.redirect("/register");
       } 
       passport.authenticate("local")(req, res, function(){
           req.flash("success", "Welcome To NEWS LINE " + user.username);
           res.redirect("/dashboard");
       });
    });
});


// show login form
router.get("/login", function(req, res) {
    res.render("login");
});

router.get('/dashboard', (req, res) => {
    res.render('dashboard', { hideForm: false });
})

// handle login logic
router.post("/login", passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/login"
}), function(req, res) {});

// logout route
router.get("/logout", function(req, res) {
    req.logout();
    req.flash("success", "Logged you out!");
    res.redirect("/login");
});

module.exports = router;