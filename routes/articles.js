var express         = require("express");
var router          = express.Router();
var middleware      = require("../middleware");

//INDEX - Show all campgrounds
router.get("/", middleware.isLoggedIn, (req, res) => {
    res.render("articles/saved", { hideForm: true });
});


module.exports = router;