const express = require("express");
const cors = require("cors");
const ws = require("./solver/wordle-solver.js")
const fs = require('fs')


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

app.post("/checkValid", (req, res) => {
  var wordle = new ws.WordleSolver
  console.log("Checking validity of " +req.body["word"])
  var validity =wordle.checkValid(req.body["word"]) 
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
        // res.send("erode")
    })
})

app.post("/score", (req, res) => {
    console.log(req.body);
    var wordle = new ws.WordleSolver;
    console.log(req.body["secret"])
    var score = (wordle.score(req.body["secret"], req.body["guess"]))
    res.send(score);
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`);
});
