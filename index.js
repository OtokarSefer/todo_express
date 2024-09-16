const express = require("express")
const app = express()

const path = require("path")
app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))

app.get("/", (req, res) => {
    const tasks = ["Study HTML", "Study CSS", "Study JS", "Study OOP"] 
    res.render("index")
})

app.listen(3001, () => {
    console.log("Example app is started at http://localhost:3001")
}) 