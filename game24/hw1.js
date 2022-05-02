const express = require('express');
const game24solver = require('24game-solver/dist/24game-solver');

const app = express();
app.use(express.json());

const num = (n) => (typeof n) == "number";
const num19 = (n) => (n > 0 && n < 10);

app.post('/',(req,res) =>{
    const bd = req.body;

    console.log(bd)

    if(!bd.n1 || !bd.n2 || !bd.n3 || !bd.n4){
        return res.status.send('Error ka')

    }
    
    if(!num(bd.n1) || !num(bd.n2) || !num(bd.n3)  || !num(bd.n4)){
        return res.status(403).send('Mai chai number ka')
    }

    if(!num19(bd.n1) || !num19(bd.n2) || !num19(bd.n3) || !num19(bd.n4) ){
        return res.status(403).send('Mai chai 1-9 ka')
    }

    const result = game24solver([bd.n1,bd.n2,bd.n3,bd.n4], 24);

    if(result.length == 0) return res.send('Mai cher pon lub ka')

    res.send({ msg: 'Sed law ka', data:result})

})


app.listen(3000 , () => {
    console.log('Listening on port: 3000');
});