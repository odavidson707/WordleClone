var lineNumber = 0
var colNumber = 0
var secret = ""

function addLetter(letter) {
    const table = document.getElementById("guessTable")
    table.rows[lineNumber].cells[colNumber].classList.add("guess")
    table.rows[lineNumber].cells[colNumber].classList.remove("guessEmpty")
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

async function checkValid(message) {
    const response = await axios.post("http:127.0.0.1:3000/checkValid", 
        {
            word: message.toLowerCase()
        }
    )
    console.log("How do I return a value from a function after axios request?")
    console.log(response.data)
    
    if (response.data == false) {
        alert("Not a recognized word")
        return false;
    }
        
    return true; 
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
        var elements = document.getElementsByClassName("letterButton");
        for (var i = 0; i < 26; i++) {
           console.log(elements[i].innerHTML) 
        }
                    

        // Source - https://stackoverflow.com/a
        // Posted by harpo, modified by community. See post 'Timeline' for change history
        // Retrieved 2025-11-07, License - CC BY-SA 4.0
        var elementArr = Array.prototype.slice.call( elements )
        for (var i = 0; i < 26; i++) {
           console.log(elementArr[i].innerHTML) 
        }
                    

        for (var i = 0; i < 5; i++) {
            console.log(response.data[i])
            switch(response.data[i][1]) {
                case "GREEN":
                    table.rows[lineNumber].cells[i].classList.add("perfect")
                    table.rows[lineNumber].cells[i].classList.remove("guess")
                    
                    var letter = response.data[i][0]
                    var found = elementArr.filter(element => element.innerHTML == letter.toUpperCase())
                    found[0].classList.add("perfectKeyBoard")

                    break;
                case "ORANGE":
                    table.rows[lineNumber].cells[i].classList.add("imperfect")
                    table.rows[lineNumber].cells[i].classList.remove("guess")
                    
                    var letter = response.data[i][0]
                    var found = elementArr.filter(element => element.innerHTML == letter.toUpperCase())
                    console.log(found)
                    found[0].classList.add("imperfectKeyBoard")

                    break;
                case "GRAY":
                    table.rows[lineNumber].cells[i].classList.add("miss")
                    table.rows[lineNumber].cells[i].classList.remove("guess")
                    
                    var letter = response.data[i][0]
                    var found = elementArr.filter(element => element.innerHTML == letter.toUpperCase())
                    console.log(found)
                    found[0].classList.add("missKeyBoard")

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
    var elements = document.getElementsByClassName("letterButton");
    console.log("Should be 26", elements.length)

    console.log(elements[0].innerHTML)

    for (var i = 0; i < elements.length; i++) {
        elements[i].addEventListener('click', function () {
            addLetter(this.innerHTML);
        })
    }
    console.log("This should happen on page load")
    axios.get("http:127.0.0.1:3000/getKey")
    .then(response => {
        secret = response.data
        const table = document.getElementById("guessTable")
        console.log(table.innerHTML)
        for (var i = 0; i < 6; i++) {
            for (var j = 0; j < 5; j++) {
                table.rows[i].cells[j].classList.add("guessEmpty")
            }
        }

    })

}


document.body.onkeydown = function(e){
    //alert(String.fromCharCode(e.keyCode)+" --> "+e.keyCode);
    keyPress(e)
};

document.getElementById("enter").addEventListener("click", validateAndGuess)
document.getElementById("backspace").addEventListener("click", removeLetter)

async function validateAndGuess() {
    var valid = await checkValid(getGuess())
    if (valid) {
        getScore()
    }
}

async function keyPress(e) {
    key = e.key
    if (key == "Enter") {
        await validateAndGuess();
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