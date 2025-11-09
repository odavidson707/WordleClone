var mongoose = require("mongoose")

const Schema = mongoose.Schema

const UserSchema = new Schema({
    wins: Number,
    turnsToWin: [Number],
    name: String
});
const User = mongoose.model("User", UserSchema);

module.exports = {
    User:User
}