const express = require('express')

const app = express();
const port = 3002;

app.post('/upload',(req,res) =>{
    console.log(req);
    res.status(200);
    res.end('Upload');
})

app.listen(port,() => {
    console.log(`server is running on ${port}`)
})