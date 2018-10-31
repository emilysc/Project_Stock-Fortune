var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var UserSchema = new Schema({
    displayName: {
        type: String,
        required: true
    },
    googleId: {
        type: String,
        required: true
    },
    profileImageUrl: {
        type: String
    },
});

var User = mongoose.model("users", UserSchema);

module.exports = User;