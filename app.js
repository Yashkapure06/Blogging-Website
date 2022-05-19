const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");
const _ = require("lodash");
const fs = require("fs");
const path = require("path");
const multer = require("multer");
require("dotenv").config();

const homeStartingContent =
  "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";

const app = express();

// Mongoose
mongoose.connect(
  process.env.MONGO_URL,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err) => {
    console.log(err || "Connected to MongoDB");
  }
);


app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.get('/', function(req, res){
  res.render('home', {
    title: "Home",
    content: homeStartingContent
  })
})
// Set EJS as templating engine 
app.set("view engine", "ejs");



  
  
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now())
    }
});
  
const upload = multer({ storage: storage });

const imgModel = require('./model');

app.get('/', (req, res) => {
  imgModel.find({}, (err, items) => {
      if (err) {
          console.log(err);
          res.status(500).send('An error occurred', err);
      }
      else {
          res.render('home', { items: items });
      }
  });
});

app.post('/', upload.single('image'), (req, res, next) => {
  
  var obj = {
      name: req.body.name,
      desc: req.body.desc,
      img: {
          data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.filename)),
          contentType: 'image/png'
      }
  }
  imgModel.create(obj, (err, item) => {
      if (err) {
          console.log(err);
      }
      else {
          // item.save();
          res.redirect('/');
      }
  });
});





  
var port = process.env.PORT || '3001'
app.listen(port, err => {
    if (err)
        throw err
    console.log('Server listening on port', port)
})