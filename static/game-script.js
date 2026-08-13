function printGuesses() {
    secret = localStorage.getItem("secret")
    guesses = localStorage.getItem("guesses")

    guesses = guesses.split(',')

    const table = document.getElementById("guessTable")
    console.log(table.innerHTML)

    for (var i = 0; i < 6; i++) {
        for (var j = 0; j < 5; j++) {
            table.rows[i].cells[j].classList.add("guessEmpty")
        }
    }

    for (var i = 0; i < guesses.length; i++) {
        for (var j = 0; j < 5; j++) {
            console.log(guesses[i].split(''))
            table.rows[i].cells[j].innerHTML = guesses[i].split('')[j]
        }
    }

    for (var i = 0; i < guesses.length; i++) {
        (async() => await getScore(guesses[i], secret, i))()

    }

}


async function getScore(guess, secret, lineNumber) {
    console.log("Get score is called in game script")
    return axios.post("http://127.0.0.1:3000/score",
        {
            guess: guess.toLowerCase(),
            secret: secret
        }
    ).then(response => {
        // Access the response data
        var greens = 0
        console.log(response.data);
        const table = document.getElementById("guessTable")
        //for i in range 5
        //console.log(response.data[i])

        // Source - https://stackoverflow.com/a
        // Posted by harpo, modified by community. See post 'Timeline' for change history
        // Retrieved 2025-11-07, License - CC BY-SA 4.0
                    

        for (var i = 0; i < 5; i++) {
            console.log(response.data[i])
            switch(response.data[i][1]) {
                case "GREEN":
                    greens++
                    table.rows[lineNumber].cells[i].classList.add("perfect")
                    table.rows[lineNumber].cells[i].classList.remove("guessEmpty")
                    
                    table.rows[lineNumber].cells[i].innerHTML = response.data[i][0].toUpperCase()

                    break;
                case "ORANGE":
                    table.rows[lineNumber].cells[i].classList.add("imperfect")
                    table.rows[lineNumber].cells[i].classList.remove("guessEmpty")
                    table.rows[lineNumber].cells[i].innerHTML = response.data[i][0].toUpperCase()
                    
                    break;
                case "GRAY":
                    table.rows[lineNumber].cells[i].classList.add("miss")
                    table.rows[lineNumber].cells[i].classList.remove("guessEmpty")
                    table.rows[lineNumber].cells[i].innerHTML = response.data[i][0].toUpperCase()
                    
                    break;

            }
            //if response.data[i][1]
            if (greens == 5) {
                console.log("Greens is 5")
                colNumber = 0
                return true
            }
        }

        colNumber = 0
        return false
        // Process the response data here
    })
    .catch(error => {
        // Handle any errors
        console.error(error)
    });

    return false;
 }