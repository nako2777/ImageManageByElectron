const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const app = express();
const cors = require("cors");
// const got = require("got");
const axios = require("axios")
const envConfig = require("./public/config")
const FormData = require("form-data")

const port = envConfig.port;
const apiKey = envConfig.apiKey;
const apiSecret = envConfig.apiSecret; 


const stroage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "uploads",JSON.parse(req.query.pathList).join("/")));
  },
  filename: (req, file, cb) => {
    cb(null, decodeURIComponent(file.originalname));
  },
});
const upload = multer({ storage: stroage });
app.use(cors());

app.post("/upload", upload.array("photos"), (req, res) => {
  req.files.forEach(file => {
    getPicInfo(file)
  })
  res.status(200);
  res.end("Upload");
});

app.get("/getDirStructure", (req, res) => {
  const result = getDirStructure(JSON.parse(req.query.pathList));
  res.end(JSON.stringify(result));
});

app.get("/downloadFile", (req, res) => {
  const result = downloadFile(
    req.query.name,
    JSON.parse(req.query.pathList),
    res
  );
});

app.get("/deleteFile", (req, res) => {
  const result = deleteFile(
    JSON.parse(req.query.files),
    JSON.parse(req.query.pathList),
    res
  );
})

app.get("/searchFile", (req, res) => {
  const result = searchFile(req.query.fileKeys, JSON.parse(req.query.pathList))
  res.end(JSON.stringify(result));
})  




const getPicInfo = (file) => {
  const formData = new FormData()
  formData.append("image",fs.createReadStream(file.path))
  axios.post("https://api.imagga.com/v2/uploads",{
    body:formData,
    username:apiKey,
    password:apiSecret
  }).then(res =>{
    // console.log(typeof res)
    fs.writeFile("example.txt",res,err=>{
      console.log(err)
    })
  })
}

const searchFile = (fileKeys,pathList,results = []) =>{
  const searchPath = path.join(__dirname,"uploads",pathList.join("/"));
  const files = fs.readdirSync(searchPath);
  files.forEach(file => {
    const stat = fs.statSync(path.join(searchPath,file));
    if(stat.isDirectory()){
      pathList.push(file);
      searchFile(fileKeys,pathList,results)
    }else{
      results.push(file)
    }
  })
  return results;
}

const deleteFile = (files,pathList,res)=> {
   const filePath = path.join(__dirname,"uploads",pathList.join("/"));
   files.forEach(file => {
      const deleteFilePath = path.join(filePath,file.name)
      fs.unlink(deleteFilePath,(err)=>{
        if(err){
          console.log('deleting ERROR:',err);
        }else{
          res.status(200).end('delete success')
        }
      })
   })
}

const downloadFile = (name, pathList, res) => {
  const filePath = path.join(__dirname, "uploads", pathList.join("/"), name);
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.status(500).send("Error downloading");
    }
    // res.setHeader('Content-Type','image/jpeg');
    // res.setHeader("Content-Disposition", `attachment`);
    res.send(data);
  });
};

const getDirStructure = (pathList) => {
  const dirNow = path.join(__dirname, "uploads", pathList.join("/"));
  const files = fs.readdirSync(dirNow);
  const result = [];
  files.forEach((file) => {
    const stat = fs.statSync(path.join(dirNow, file));
    result.push({
      isDir: stat.isDirectory(),
      name: file,
      size: stat.size,
      birthtime: stat.birthtime,
      icon: stat.isDirectory() ? "folder" : "image", //TODO:それぞれのファイルタイプのアイコン
    });
  });
  return result;
};

app.listen(port, () => {
  console.log(`server is running on ${port}`);
});
