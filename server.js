const express = require("express");
const bodyParser = require("body-parser");
const multer = require('multer');
const { exec } = require('child_process');
const fs = require('fs');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix + ".mp4")
  }
})
const upload = multer({ storage: storage })

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/submit", upload.single('file'), (req, res) => {
  console.log(req, '=========')
  console.log(req.file, req.files, "--------------")
  const name = req.file.filename.split(".")[0];
  fs.mkdirSync(`hls/${name}`);
  
  const yourscript = exec(`ffmpeg -i ${req.file?.path} -codec: copy -start_number 0 -hls_time 10 -hls_list_size 0 -f hls hls/${name}/${name}.m3u8`,
        (error, stdout, stderr) => {
            // console.log(stdout, '=====');
            //   console.log(stderr, '+++++++');
            if (error !== null) {
                console.log(`exec error: ${error}`);
            }
        });
  yourscript.on("exit", function (code, signal) {
    if (code === 0) {
      console.log("Process exit with code : " + code);
      console.log("Process exited with signal : " + signal);
      // fs.unlinkSync(req.file?.path)
      res.send("file received");
    } else {
      res.send("file not received");
    }
  });
  
})
app.listen(3003, () => {
  console.log("Server running on port 3003");
})