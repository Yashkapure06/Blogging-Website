const express = require("express");

//bring in mongoose
const mongoose = require("mongoose");

//bring in method-override
const methodOverride = require("method-override");

const blogRoute = require("./routes/blogs");
const Blog = require("./models/Blog");
const dotenv = require('dotenv');
dotenv.config();

const app = express();

app.use('/public', express.static('public'))

// lets get connected with Mongoose
mongoose.connect(
  process.env.CONNECTION_URL,
  //process.env.MONGO_URL is the environment variable that is set in the .env file
  {
    useNewUrlParser: true,
    //useNewUrlParser is a method that is used to parse the url
    useUnifiedTopology: true,
    //useUnifiedTopology is a method that is used to connect to the database
    useCreateIndex: true,
    //useCreateIndex is a method that is used to create indexes
  },
  (err) => {
    console.log(err || "Connected to MongoDB");
  }
);

// Lets set template engine
app.set("view engine", "ejs");
// set() is a method that is used to set a value for a key
app.use(express.urlencoded({ extended: false }));
// use() is a method that is used to use a middleware
// express.urlencoded() is a middleware that is used to parse the data sent by the user
app.use(methodOverride("_method"));
// methodOverride() is a middleware that is used to override the method

// Route for index
app.get("/", async (req, res) => {
  const blogs = await Blog.find().sort({ timeCreated: "desc" });
  // find() => this method finds and returns all documents that match the query criteria.
  // sort() => this method sorts the documents in the collection.
  res.render("index", { blogs: blogs });
});
app.use(express.static("public"));
// use() is a method that is used to use a middleware
// express.static() is a middleware that is used to serve static files
app.use("/blogs", blogRoute);

var port = process.env.PORT || 3000;
app.listen(port, (err) => {
  if (err) throw err;
  console.log("Server listening on port", port);
});
