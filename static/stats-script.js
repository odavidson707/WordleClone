function printStats() {
    axios.get("http:127.0.0.1:3000/getStats")
    .then(response => {
        console.log(response.data)
        const turnsToWin = response.data["turnsToWin"]
        const table = document.getElementById("statsTable")
        for (let i = 0; i < 6; i++) {
            table.rows[i+1].cells[1].innerHTML = turnsToWin[i]
        }
    })
}