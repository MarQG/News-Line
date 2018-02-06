var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: "You must have a username",
        unique: "Username already taken",
    },
    password: {
        type: String,
        required: "Password cannot be empty.",
        min: 8
    },
    email: {
        type: String,
        validate: function(email) {
            return /^[a-zA-Z0-9.!#$%&’*+\/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email);
        }
    }
});

UserSchema.plugin(passportLocalMongoose, { saltlen: 16, iterations: 15});

module.exports = mongoose.model("User", UserSchema);