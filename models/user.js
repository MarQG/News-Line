var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var UserSchema = new mongoose.Schema({
    username: String,
    password: String,
    email: String
});

UserSchema.plugin(passportLocalMongoose, { saltlen: 16, iterations: 15});

module.exports = mongoose.model("User", UserSchema);