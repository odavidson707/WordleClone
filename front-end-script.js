var lineNumber = 0
var colNumber = 0
var secret = ""

function addLetter(letter) {
    const table = document.getElementById("guessTable")
    table.rows[lineNumber].cells[colNumber].innerHTML = letter.toUpperCase()
    colNumber++;
}

function removeLetter() {
    if (colNumber == 0) {
        return;
    }
    colNumber--;
    const table = document.getElementById("guessTable")
    table.rows[lineNumber].cells[colNumber].innerHTML = ""
}

function getGuess() {
    const table = document.getElementById("guessTable")
    if (colNumber != 5) {
        console.log("Must have complete word to guess")
        return false;
    }
    var rtn = ""
    for (var i = 0; i < 5; i++) {
        rtn += table.rows[lineNumber].cells[i].innerHTML
    }
    return rtn
}

function getScore() {
    const message = getGuess()
    if (message == false) {
        return;
    }
    console.log(message)
    axios.post("http:127.0.0.1:3000/score",
        {
            guess: message.toLowerCase(),
            secret: secret
        }
    ).then(response => {
        // Access the response data
        console.log(response.data);
        const table = document.getElementById("guessTable")
        //for i in range 5
        //console.log(response.data[i])
        for (var i = 0; i < 5; i++) {
            console.log(response.data[i])
            switch(response.data[i][1]) {
                case "GREEN":
                    table.rows[lineNumber].cells[i].classList.add("perfect")
                    table.rows[lineNumber].cells[i].classList.remove("guess")
                    break;
                case "ORANGE":
                    table.rows[lineNumber].cells[i].classList.add("imperfect")
                    table.rows[lineNumber].cells[i].classList.remove("guess")
                    break;
                case "GRAY":
                    table.rows[lineNumber].cells[i].classList.add("miss")
                    table.rows[lineNumber].cells[i].classList.remove("guess")
                    break;

            }
            //if response.data[i][1]
        }

        lineNumber++
        colNumber = 0
        // Process the response data here
    })
    .catch(error => {
        // Handle any errors
        console.error(error)
    });

    return false;
 }

function getKey() {
    console.log("This should happen on page load")
    axios.get("http:127.0.0.1:3000/getKey")
    .then(response => {
        secret = response.data
        const table = document.getElementById("guessTable")
        console.log(table.innerHTML)
        for (var i = 0; i < 6; i++) {
            for (var j = 0; j < 5; j++) {
                table.rows[i].cells[j].classList.add("guess")
            }
        }

    })

}


document.body.onkeydown = function(e){
    //alert(String.fromCharCode(e.keyCode)+" --> "+e.keyCode);
    keyPress(e)
};

function keyPress(e) {
    key = e.key
    if (key == "Enter") {
        getScore()
    }
    if (key == "Backspace") {
        removeLetter()
    }
    if (e.code === `Key${key.toUpperCase()}`){
        console.log("Pressing alpha key: ", key)
        addLetter(key)
    }
}


// document.getElementById("myInput").addEventListener("submit", function(event){
//     event.preventDefault();
//     console.log("Why is form submission so annoying?")
//     getScore()
// });