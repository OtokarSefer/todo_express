const express = require("express");
const app = express();

const fs = require('fs'); // <-- Added fs module
const path = require("path");
let ejs = require('ejs');

let people = ['geddy', 'neil', 'alex'];
let html = ejs.render('<%= people.join(", "); %>', { people: people });

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.get("/", (req, res) => {
    fs.readFile('./tasks', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return;
        }
        console.log(data);
        console.log(typeof data);
        console.log(data.split('\n'))

        const tasks = data.split("\n")
        res.render("index"); // Rendering "index.ejs" in your views folder
    });
});

app.listen(3001, () => {
    console.log("Example app is started at http://localhost:3001");
});
