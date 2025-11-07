const fs = require('fs');
const prompt = require('prompt-sync')();

secret = "aware"
guess = ""

class WordleSolver {

    constructor() {
        this.untouched = new Set("abcdefghijklmnopqrstuvwxyz".split(''))
        this.candidates = fs.readFileSync("wordle-La.txt").toString().split("\n")
        for (const i in this.candidates) {
            this.candidates[i] = this.candidates[i].split("\r")[0]
        }
        this.guessable = fs.readFileSync("wordle-Ta.txt").toString().split("\n")
        for (var i in this.guessable) {
            this.guessable[i] = this.guessable[i].split("\r")[0]
        }
        this.perfect = []
        this.imperfect = []
        this.misses = []
    }

    eliminateCandidates() {
        var start = this.candidates.length
        //O(26 * candidates) = O(candidates)
        //also consider how long it takes to check if letter is in word
        //for every letter in perfect:
        //for every candidate:
        //if candidate doesn't have that letter at that position,
        //remove it

        for (var i = 0; i < this.perfect.length; i++) {
            var indicesToDelete = []
            for (var j = 0; j < this.candidates.length; j++) {
                //console.log("Candidate at perfect index", this.candidates[j][this.perfect[i][1]])
                if (this.candidates[j][this.perfect[i][1]] != this.perfect[i][0]) {
                 //   console.log("Trying to remove", this.candidates[j])
                    indicesToDelete.push(j)
                }
            }
            for (var j = indicesToDelete.length - 1; j >= 0; j--) {
                this.candidates.splice(indicesToDelete[j], 1)
            }
        }

        //for every letter in imperfect:
        //for every candidate:
        //if candidate doesn't have that letter somewhere,
        //remove it
        for (var i = 0; i < this.imperfect.length; i++) {
            var indicesToDelete = []
            for (var j = 0; j < this.candidates.length; j++) {
                if (this.candidates[j].indexOf(this.imperfect[i]) == -1) {
                    indicesToDelete.push(j)
                }
            }
            for (var j = indicesToDelete.length - 1; j >= 0; j--) {
                this.candidates.splice(indicesToDelete[j], 1)
            }
        }

        //for every letter in misses:
        //for every candidate:
        //if candidate has that letter somewhere,
        //remove it
        for (var i = 0; i < this.misses.length; i++) {
            var indicesToDelete = []
            for (var j = 0; j < this.candidates.length; j++) {
                if (this.candidates[j].indexOf(this.misses[i]) != -1) {
                    indicesToDelete.push(j)
                }
            }
            for (var j = indicesToDelete.length - 1; j >= 0; j--) {
                this.candidates.splice(indicesToDelete[j], 1)
            }
        }

        var end = (this.candidates.length)
        return start-end
    }

    commonLetters(secret, guess){
        var secretArr = secret.split("")
        var guessArr = guess.split("")

        var secretSet = new Set(secretArr)
        var guessSet = new Set(guessArr)

        return secretSet.intersection(guessSet)
    }

    exactMatch(secret, guess, letter) {
        return secret.indexOf(letter) == guess.indexOf(letter)
    }

    countLetterInScore(score, letter) {
        var rtn = 0
        for (var i = 0; i < score.length; i++) {
            if (score[i][0] == letter) {
                rtn++
            }
        }
        return rtn
    }

    perfectInWord(secret, guess, letter) {
        for (let idx = 0; idx < 5; idx++) {
            if(secret.charAt(idx) == guess.charAt(idx) && secret.charAt(idx) == letter) {
                return true
            } 
        }
        return false
    }

    score(secret, guess) {
        var letters = this.commonLetters(secret, guess)

        var score = []

        const guessArr = [...guess]
        guessArr.forEach((letter, idx) =>{
            if (secret.charAt(idx) == letter) { //if perfect match
                score.push([letter, "GREEN"])
                this.addToPerfect(letter, idx)
            } else if (secret.indexOf(letter) != -1) { //if imperfect match
                const letterCount = this.countLetterInScore(score, letter)
                //if the letter is already scored 
                if (letterCount >= 1) { //there is already an instance of this letter in the score.
                                        //if there are letterCount + 1 instances in the secret, score, otherwise, no score
                    var re = new RegExp(letter, "g");
                    if (!((secret.match(re) || []).length >= letterCount+1)) {
                        score.push([letter, "GRAY"])
                    } else {
                        score.push([letter, "ORANGE"])
                        this.addToImperfect(letter)
                    }
                }
                //regular imperfect
                else {
                    if (this.perfectInWord(secret, guess, letter)) {
                        score.push([letter, "GRAY"])
                    } 
                    else{
                        score.push([letter, "ORANGE"])
                        this.addToImperfect(letter)
                    }
                }
            }   
            //total miss
            else { 
                score.push([letter, "GRAY"])
                this.addToMisses(letter)
            }
        });

        this.eliminateCandidates()
        return score
    }

    addToPerfect(letter, idx) {
        this.perfect.push([letter, idx])
    }

    addToImperfect(letter) {
        this.imperfect.push(letter)
    }

    addToMisses(letter) {
       this.misses.push(letter) 
    }

    bestGuess() {
        //for every guess
        //for every candidate - calculate how many candidates will be removed
        //take the average of these
        //choose the guess with the maximum average
        if (this.candidates.length == 1) {
            return this.candidates[0]
        }
        var maxAvg = 0
        var bestGuess = ""
        for (var i = 0; i < this.guessable.length; i++) {
            var avg = 0
            for (var j = 0; j < this.candidates.length; j++) {
                const candidatesCopy = this.candidates.slice()
                const perfectCopy = this.perfect.slice()
                const imperfectCopy = this.imperfect.slice()
                const missesCopy = this.misses.slice()

                avg += this.score(this.candidates[j], this.guessable[i])
                
                this.candidates = candidatesCopy
                this.perfect = perfectCopy
                this.imperfect = imperfectCopy
                this.misses = missesCopy
            }
            avg /= this.candidates.length
            if (avg > maxAvg) {
                maxAvg = avg
                bestGuess = this.guessable[i]
            }
        }
        return bestGuess
    }
    printStats() {
        console.log("Perfect:", this.perfect)
        console.log("Imperfect:", this.imperfect)
        console.log("misses:", this.misses)

        console.log("Number of candidates: ", this.candidates.length)
        if (this.candidates.length < 10) {
            console.log(this.candidates)
        }
    }
    manualScore() {
        do {
            var perfect = prompt("enter perfect")
            if (perfect == "print") {
                this.printStats()
            }
            if (perfect != "") {
                var idx = prompt("Index?")
                this.addToPerfect(perfect, idx)
            }
        } while(perfect != "")
        var imperfect = prompt("enter imperfect").split("")
        var misses = prompt("enter misses").split("")

        for (const i in perfect) {
            this.addToPerfect(perfect[i])
        }

        for (const i in imperfect) {
            this.addToImperfect(imperfect[i])
        }

        for (const i in misses) {
            this.addToMisses(misses[i])
        }
        this.eliminateCandidates()
    }
    samplingGuess(fraction) {
        var sampledCandidates = []
        for (const i in this.candidates) {
            if (Math.random() < fraction) {
                sampledCandidates.push(this.candidates[i])
            }
        }
        const candidatesCopy = this.candidates.slice()
        this.candidates = sampledCandidates
        const sampledGuess = this.bestGuess()
        this.candidates = candidatesCopy

        if (sampledGuess == "") {
            return this.candidates[0]
        }
        return sampledGuess
    }
}
//ws.score(secret, "month")
//ws.manualScore()

function automated(secret) {
    var ws = new WordleSolver()
    var count = 0
    ws.score(secret, "adieu")
    while (guess != secret && count < 6) {
        if (ws.candidates.length > 100) {
            guess = ws.samplingGuess(.1)
        } else {
            guess = ws.bestGuess()
        }
    console.log("Best guess: ", guess)
        ws.score(secret, guess)
        count++
    }

}

function manual() {
    var ws = new WordleSolver()
    var count = 0
    ws.manualScore()
    while (count < 6) {
        if (ws.candidates.length > 100) {
            guess = ws.samplingGuess(.1)
        } else {
            guess = ws.bestGuess()
        }
    console.log("Best guess: ", guess)
        ws.manualScore()
        count++
    }
}

function promptGuess() {
    var secret = "trees"
    //guess eexxx
    var ws = new WordleSolver()
    while (true) {
        var guess = prompt("enter guess")
        console.log(ws.score(secret, guess))
    }
}

promptGuess()

module.exports = {
    WordleSolver
}