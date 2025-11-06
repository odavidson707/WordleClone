var lineNumber = 0
var secret = ""
function displayLetters() {
//   document.getElementById("").innerHTML = document.getElementById("myInput").value;
    var len = document.getElementById("myInput").value.length

    const table = document.getElementById("guessTable")
    for(var i = 0; i < 5; i++) {
        if (i < len)
            table.rows[lineNumber].cells[i].innerHTML = document.getElementById("myInput").value[i]
        else
            table.rows[lineNumber].cells[i].innerHTML = ""
    }
    
}
function getScore() {
    const message = document.getElementById("myInput").value
    console.log(message)
    axios.post("http:127.0.0.1:3000/score",
        {
            guess: message,
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
    document.getElementById("wordForm").focus()
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

document.getElementById("myInput").addEventListener("input", displayLetters);

document.body.onkeydown = function(e){
    //alert(String.fromCharCode(e.keyCode)+" --> "+e.keyCode);
};


// document.getElementById("myInput").addEventListener("submit", function(event){
//     event.preventDefault();
//     console.log("Why is form submission so annoying?")
//     getScore()
// });