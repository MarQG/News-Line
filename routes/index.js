const express         = require("express");
const router          = express.Router();
const passport        = require("passport");
const User            = require("../models/user");
const middleware      = require('../middleware/index');


// ROOT ROUTE
router.get("/", (req, res) => {
    res.render("landing");
});

// ============
// AUTH ROUTES
// ============

// show register form
router.get("/register", (req, res) => {
    res.render("register");
});

// handle sign up logic
router.post("/register", (req, res) => {
    const newUser = new User({username: req.body.username, email: req.body.email});

    User.register(newUser, req.body.password, (err, user) => {
       if(err){
           req.flash("error", err.message);
           
           return res.redirect("/register");
       } 
       passport.authenticate("local")(req, res, () =>{
           req.flash("success", "Welcome To NEWS LINE " + user.username);
           res.redirect("/dashboard");
       });
    });
});


// show login form
router.get("/login", (req, res) => {
    if(req.user){
       return res.redirect('/dashboard');
    }
    res.render("login");
});

router.get('/dashboard', middleware.isLoggedIn, (req, res) => {
    res.render('dashboard', { hideForm: false });
})

// handle login logic
router.post("/login", passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/login"
}));

// logout route
router.get("/logout",  (req, res) => {
    req.logout();
    req.flash("success", "Logged you out!");
    res.redirect("/login");
});

module.exports = router;