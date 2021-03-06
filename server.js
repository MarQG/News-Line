const express         = require("express");
const app             = express();
const bodyParser      = require("body-parser"); 
const mongoose        = require("mongoose");
const flash           = require("connect-flash");
const passport        = require("passport");
const localStrategy   = require("passport-local").Strategy;
const methodOverride  = require("method-override");
const User            = require("./models/user");

const port = process.env.PORT || 3000;

    
//requiring routes
    
const indexRoutes = require("./routes/index");
const articlesPageRoutes = require("./routes/articles");
const articlesApiRoutes = require('./routes/api/articles');
const notesApiRoutes = require('./routes/api/notes');

mongoose.Promise = require('bluebird');
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/scrapper', (err) => {
    if(err){
        console.log('could not connect to the database')
    }
});
//mongoose.connect("external DB Link");

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

//Seed Database
//seedDB();

// PASSPORT CONFIGURATION

const session = {
    secret: "Miko is the cutest cat ever!",
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: new Date(Date.now() * 360000)
    }
}
app.use(require("express-session")(session));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});


// ==============
// ROUTES
// ===============

app.use("/",indexRoutes);
app.use('/articles', articlesPageRoutes);
app.use('/api', articlesApiRoutes);
app.use('/api', notesApiRoutes);



app.listen(port, () => {
    console.log("The NEWS LINE Server has started!");
});
