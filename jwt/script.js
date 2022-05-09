const express = require('express');
const jsonwebtoken = require('jsonwebtoken')
const cookieParser = require('cookie-parser')

const app = express();
app.use(express.json())
app.use(cookieParser())

const port = 3000;
const jwtkey = "jwtkey";

app.get('/', (req, res) => {
    res.sendFile(__dirname + "/jwt.html")
});

app.get('/home', (req, res) => {
    console.log(req.cookies)
    if(!req.cookies.token) return res.redirect('/error')

    let tokenResult;

    try {
        tokenResult = jsonwebtoken.verify(req.cookies.token, jwtkey)
    } catch {
        return res.redirect('/error')
    }
    
    res.sendFile(__dirname + "/home.html")
});

app.get('/error', (req, res) => {
    res.sendFile(__dirname + "/error.html")
});

app.get('/style.css', (req, res) => {
    res.sendFile(__dirname + "/style.css")
});

app.post('/login', (req, res) => {
    const username = req.body.user;
    const password = req.body.pass;

    if(!username || !password) 
    return res.status(400).json({msg: "fail"})

    if(username != "admin" || password != "admin") 
    return res.status(400).json({msg: "Username หรือ Password ไม่ถูกต้อง"})

    const token = jsonwebtoken.sign({
        user: username
    }, jwtkey)

    res.cookie('token',token)
    res.send({msg: "ok"})
})

app.listen(port, () => {
    console.log(`Listening at port ${port}`);
});