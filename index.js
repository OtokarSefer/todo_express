const express = require("express");
const app = express();

const fs = require('fs');
const path = require("path");
let ejs = require('ejs');

let people = ['geddy', 'neil', 'alex'];
let html = ejs.render('<%= people.join(", "); %>', { people: people });

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

const readFile = (filename) => {
    return new Promise((resolve, reject) => {
        fs.readFile(filename, 'utf8', (err, data) => {
            if (err) {
                console.error(err)
                return
            }
            const tasks = JSON.parse(data)
            resolve(tasks)
            })
    })
}

app.get("/", (req, res) => {
    readFile('./tasks.json')
        .then(tasks => {
            console.log(tasks)
            res.render('index', {tasks: tasks})
})})

app.use(express.urlencoded({ extended: true}))

app.post('/', (req, res) => {
    readFile('./tasks.json')
    .then(tasks => {
        tasks.push(req.body.task)
        const data = tasks.join("\n")
        fs.writeFile('./tasks.json', data, (err) => {
            if (err) {
                console.error(err)
                return
                }
                res.redirect('/')
                })
        console.log(data)
    })
})

app.listen(3001, () => {
    console.log("Example app is started at http://localhost:3001");
});
