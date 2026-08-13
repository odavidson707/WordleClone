
var mongoose = require("mongoose")

const Schema = mongoose.Schema

const GameSchema = new Schema({
    guesses: [String],
    secret: String
});
const Game = mongoose.model("Game", GameSchema);

module.exports = {
    Game:Game
}