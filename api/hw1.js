const express = require('express');

const app = express();
app.use(express.json());

let data = []

app.get('/get_data',(req,res) => {
    res.send(data);
})

app.post('/post_data',(req,res) => {
    
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
    
    for(let i = 0; i < data.length; i++){
        if (data[i].id == epminfo.id ||
            data[i].email == epminfo.email ||
            data[i].tel == epminfo.tel){
            return res.status(400).send("Your information has already been used.");
        }
    }

    data.push(epminfo)
    console.log(epminfo)

    res.send('Create Data Success');
})

app.put('/push_data',(req,res) => {
    if (!req.body.id ||
        !req.body.tel ||
        !req.body.email ||
        !req.body.position 
        ) {
        return res.status(400).send("Error");
    }
    for(let i = 0; i < data.length; i++){
        if (data[i].id == req.body.id){
        
        data[i].id = req.body.id
        data[i].tel = req.body.tel
        data[i].email = req.body.email
        data[i].position = req.body.position

        return res.send("Update Information Success");
        }
    }
    return res.status(400).send("Error");
})

app.delete('/delete_data',(req,res) => {
    if (!req.body.id){
        return res.status(400).send("Error");
    }
    for(let i = 0; i < data.length; i++){
        if (data[i].id == req.body.id){
        data.splice(i, 1);    
        return res.send("Delete Information Success");
        }
    }
    res.status(400).send("Error");
})


app.listen(3000 , () => {
    console.log('Listening on port: 3000');
});