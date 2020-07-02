var mongoose= require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");
var UserSchema= new mongoose.Schema(
    {
        username: String,
        password: String
    }
)
// adding some methods to our User
UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);