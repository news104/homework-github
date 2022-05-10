const express = require('express');
const { createPool } = require('mysql2')
const jsonwebtoken = require('jsonwebtoken')

const jwtkey = "key123456789"
const sqlPool = createPool({
    namedPlaceholders: true,
    charset: 'utf8',
    host: "127.0.0.1",
    port: 3306,
    user: "root",
    password: "",
    database: "employee",
})

const app = express();
app.use(express.json());

app.use((req, res, next) => {
    if(req.path == "/login") return next()

    const auth = req.headers.authorization

    if(!auth) return res.json({msg: "Error unauthorized"})

    const token = auth.split(' ')[1]

    if(!token) return res.json({msg: "Error unauthorized"})

    jsonwebtoken.verify(token, jwtkey, (err, result) => {
        if(err) return res.json({msg: "Error unauthorized"})
        console.log({result})
        next()
    })
})

app.post('/login', (req, res) => {
    const username = req.body.user;
    const password = req.body.pass;

    if(!username || !password) 
    return res.status(400).json({msg: "FAIL"})

    if(username != "admin" || password != "admin") 
    return res.status(400).json({msg: "Username หรือ Password ไม่ถูกต้อง"})

    const token = jsonwebtoken.sign({
        user: username
    }, jwtkey)

    res.send({msg: "OK", token})
})

app.get('/get_data',(req,res) => {
    const sql = 'SELECT * FROM employee'
    sqlPool.query(sql, (err, result) => {
        console.log({err})
        if (err) return res.status(400).json({ msg: "Error" })
        res.json({ data: result })
    })
})

app.post('/create_data',(req,res) => {
    
    const epminfo = {
        fname: req.body.fname,
        lname: req.body.lname,
        id: req.body.id,
        tel: req.body.tel,
        email: req.body.email,
        position: req.body.position
    }

    if (!epminfo.fname ||
        !epminfo.lname ||
        !epminfo.id ||
        !epminfo.tel ||
        !epminfo.email ||
        !epminfo.position
        ){
        return res.status(400).send("Error");
    }
    
    const sql = 'INSERT INTO employee VALUE (:id, :name, :lname, :pos, :tel, :mail)';

    sqlPool.query(sql, {
        id: epminfo.id,
        name: epminfo.fname,
        lname: epminfo.lname,
        pos: epminfo.position,
        tel: epminfo.tel,
        mail: epminfo.email
    }, (err, result) => {
        if (err) {
            if (err.code == "ER_DUP_ENTRY") return res.status(400).json({ msg: "ผิดพลาดเนื่องจากมีข้อมูลซ้ำ" })
            return res.status(400).json({ msg: "ข้อผิดพลาดที่ไม่รู้จัก" })
        }
        res.json({ msg: "OK" })
    })
})

app.put('/update_data',(req,res) => {
    if (!req.body.id ||
        !req.body.tel ||
        !req.body.email ||
        !req.body.position 
        ) {
        return res.status(400).send("Error");
    }

    const sql = 'UPDATE employee SET POSITION = :pos, TEL = :tel, EMAIL = :mail WHERE ID = :id'

    sqlPool.query(sql, {
        id: req.body.id,
        pos: req.body.position,
        tel: req.body.tel,
        mail: req.body.email
    }, (err, result) => {
        if (err) {
            console.log({err})
            if (err.code == "ER_DUP_ENTRY") return res.status(400).json({ msg: "ผิดพลาดเนื่องจากมีข้อมูลซ้ำ" })
            return res.status(400).json({ msg: "ข้อผิดพลาดที่ไม่รู้จัก" })
        }

        if (result.affectedRows == 0) return res.status(400).json({ msg: "ผิดพลาดไม่พบข้อมูลของ Employee" })
        res.json({ msg: "OK" })
    })
})

app.delete('/delete_data',(req,res) => {
    if (!req.body.id){
        return res.status(400).send("Error");
    }
    
    const sql = 'DELETE FROM employee WHERE ID = :id';

    sqlPool.query(sql, { id: req.body.id, }, (err, result) => {
        if (err) return res.status(400).json({ msg: "ข้อผิดพลาดที่ไม่รู้จัก" })
        if (result.affectedRows == 0) return res.status(400).json({ msg: "ผิดพลาดไม่พบข้อมูลของ Employee" })
        res.json({ msg: "OK" })
    })
})


app.listen(3000 , () => {
    console.log('Listening on port: 3000');
});