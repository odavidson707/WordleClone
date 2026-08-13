function printStats() {
    listGames()
    axios.get("http://127.0.0.1:3000/getStats")
    .then(response => {
        console.log(response.data)
        const turnsToWin = response.data["turnsToWin"]
        const table = document.getElementById("statsTable")
        for (let i = 0; i < 6; i++) {
            table.rows[i+1].cells[1].innerHTML = turnsToWin[i]
        }
    var ctx = document.getElementById('myChart').getContext('2d');
    var myChart = new Chart(ctx, {
    type: 'bar',
    indexAxis: 'y',
    data: {
        labels: ['1', '2', '3', '4', '5', '6', 'miss'],
        datasets: [{
        data: turnsToWin,
        backgroundColor: [
            'green',
            'green',
            'green',
            'green',
            'green',
            'green',
            'green',
        ],
        borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)'
        ],
        borderWidth: 1
        }]
    },
    options: {
        scales: {
        yAxes: [{
            ticks: {
            beginAtZero: true
            }
        }]
        }
        
    }
    });
    })
}

function passGuesses(secret, guesses) {
    console.log("Clicking into game review, secret is: ", secret)
    localStorage.setItem("secret", secret)
    localStorage.setItem("guesses", guesses)
    window.open("game.html")
}

function listGames() {
    //call endpoint getGames
    axios.get("http://127.0.0.1:3000/getGames")
    .then(response => {
        const games = response.data
        console.log(games)
        for (let i = 0; i < games.length; i++) {
            console.log(games[i].secret)
            console.log(games[i].guesses.length)
            var textNode = document.createTextNode(games[i].secret + " " + games[i].guesses.length + " guesses")
            var link = document.createElement("a")
            link.href = "game.html"
            link.appendChild(textNode)
            link.onclick = () => passGuesses(games[i].secret, games[i].guesses)
            var newLine = document.createElement("br")
            document.body.appendChild(newLine)
            document.body.appendChild(link)
        }
    })
    //returns an array of games - each has an array of guesses and a secret
    //display the secret and number of guesses for each game
    //make this a link PIETY 3
    //the link takes you to a page that displays all the guesses
}