const express = require('express')
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const app = express();
const cors = require('cors')

const port = 3002;


const upload = multer({dest:'uploads'});
app.use(cors());

app.post('/upload',upload.array('photos'),(req,res) =>{
    console.log(req);
    res.status(200);
    res.end('Upload');
})

app.get('/getDirStructure',(req,res) =>{
    const result = getDirStructure(req.query.dirName);
    res.end(JSON.stringify(result));
})

const getDirStructure = (dirName) =>{
    const dirNow = path.join(__dirname,'uploads',dirName)
    const files = fs.readdirSync(dirNow)
    // console.log(files)  
    const result = []
    files.forEach(file =>{
        const stat = fs.statSync(path.join(dirNow,file));
        result.push({
            isDir: stat.isDirectory(),
            name: file
        })
        // console.log(fs.statSync(path.join(dirNow,file)).isDirectory());
    })
    return result;
}

app.listen(port,() => {
    console.log(`server is running on ${port}`)
})