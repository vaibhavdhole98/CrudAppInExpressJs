const express = require('express')
const app = express()
const port = 5000

let fs = require('fs')
let bodyParser = require("body-parser")
let jsonServer = require('json-server')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())


const jsonServerMiddleware = jsonServer.router("api.json")
app.use('/api', jsonServerMiddleware);

app.set('view engine', 'ejs')

app.get('/', (req, res) => {
    // res.send('CRUD APP')
    res.redirect('/users')
})

app.get('/users', (req, res) => {
    const users = JSON.parse(fs.readFileSync("api.json")).users
    res.render('listUsers', { data: users })
})

app.post('/users', (req, res) => {
    console.log(req.body, "req.body");
    const users = JSON.parse(fs.readFileSync("api.json")).users
    let user = {
        id: Date.now(),
        name: req.body.name,
        city: req.body.city
    }
    users.push(user)
    fs.writeFileSync("api.json", JSON.stringify({ users }));
    res.redirect('/users')
})


app.get("/deleteUser/:id", (req, res) => {
    const users = JSON.parse(fs.readFileSync("api.json")).users
    let userIndex = users.findIndex((u) => u.id === parseInt(req.params.id));
    if (userIndex === -1) {
        return res.state(404).send("User not found.")
    }
    users.splice(userIndex, 1)
    fs.writeFileSync("api.json", JSON.stringify({ users }));
    res.redirect('/users')

})



app.get("/editUser/:id", (req, res) => {
    const users = JSON.parse(fs.readFileSync("api.json")).users
    const user = users.find((u) =>
        u.id === parseInt(req.params.id));
    res.render("editUser", { data: users, userData: user })
})





app.post("/editUser/:id", (req, res) => {
    console.log(req.body, "req.body");
    const users = JSON.parse(fs.readFileSync("api.json")).users
    const user = users.find((u) =>
        u.id === parseInt(req.params.id));
    if (!user) {
        return res.state(404).send("User not found.")
    }
    Object.assign(user, req.body);
    fs.writeFileSync("api.json", JSON.stringify({ users }));
    res.redirect('/users')

})





app.listen(port, () => {
    console.log(`Example app listening on port http://localhost:${port}`)
})