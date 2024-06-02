const express = require('express')
const multer = require('multer')
const path = require('path')
const app = express();

const port = 3002;

const upload = multer({dest:'uploads'});

app.post('/upload',upload.single('file'),(req,res) =>{
    console.log(req);
    res.status(200);
    res.end('Upload');
})

app.listen(port,() => {
    console.log(`server is running on ${port}`)
})