const http = require('http')
const name = 'Settachok Maka '
const date = new Date().toLocaleString()
const server = http.createServer((req,res) => {
    res.write(name + date)
    res.end()
} )

server.listen(2337, () =>{
    console.log('Server Started \n' + name + date)

})