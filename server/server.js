require('dotenv').config();
const {MongoClient} = require('mongodb')
const express = require("express");
const cors = require("cors");
const ws = require("./solver/wordle-solver.js")
const fs = require('fs')
const mongoose = require("mongoose")
const mongoConnectString = process.env.MONGODB_URI    
var Game = require("../models/game").Game
var User = require("../models/user").User

const client = new MongoClient(mongoConnectString)
const db = client.db("Wordle")
const collection = db.collection("WordleCollection")

const corsOptions = {
  origin: "*",
};

const app = express();
app.use(cors(corsOptions));
app.use(express.json())
const port = 3000;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/connect", async (req, res) => {
  
  var player = new User({wins: 0, name: "Rufus", turnsToWin: [0,0,0,0,0,0]})
  player.save()

})

app.get("/viewStats", async (req, res) => {
  await mongoose.connect(mongoConnectString)
  const query = (await User.find({name: "Rufus"}))
  console.log(JSON.stringify(query, null, 2))
})


app.post("/checkValid", (req, res) => {
  var wordle = new ws.WordleSolver
  console.log("Checking validity of " +req.body["word"])
  var validity = wordle.checkValid(req.body["word"]) 
  console.log(validity)
  if (validity == true)
    res.send("valid")
  else
    res.send("invalid")
})

app.get("/getKey", (req, res) => {
  fs.readFile("wordle-La.txt", (err, data) => {
      words = data.toString().split("\n")
      console.log(words)
      idx = Math.floor(Math.random() * (words.length))
      console.log(idx)
      word = words[idx]
      console.log(word)

      res.send(word)
      // res.send("renal")
  })
})

app.get("/getStats", async (req, res) => {
  await mongoose.connect(mongoConnectString)
  const record = await User.findOne({name:"Rufus", "turnsToWin.5": {"$exists": true}})

  res.send(record)
})

app.post("/score", (req, res) => {
    console.log(req.body);
    var wordle = new ws.WordleSolver;
    console.log(req.body["secret"])
    var score = (wordle.score(req.body["secret"], req.body["guess"]))
    res.send(score);
})

app.get("/getGames", async (req, res) => {
  await mongoose.connect(mongoConnectString)
  const games = await Game.find({}).cursor()

  var rtn = []
  while (true) {
    const game = await games.next()
    console.log(game)
    if (!game) {
      break
    }
    rtn.push(game)
  }
  console.log("Getting games")
  console.log("rtn: ", rtn)
  res.send(rtn)
})

app.post("/logWin", async (req, res) => {
  //get a user by username
  //update their document with wins
  await mongoose.connect(mongoConnectString)
  const winningTurn = req.body["turn"]
  const updateObject = {wins: 1}
  updateObject[`turnsToWin.${winningTurn}`] = 1
  const update = await User.findOneAndUpdate({name:"Rufus", turnsToWin: {$size: 6}},{$inc:updateObject})

  const guesses = req.body["guesses"]
  const secret = req.body["secret"]
  var game = new Game({guesses: guesses, secret: secret})
  game.save()

  console.log(guesses, secret)
  console.log(JSON.stringify(update, null, 2))
  
  console.log("Am I logging win?")
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`);
});
