var express = require("express");
var bodyParser = require("body-parser");

var app = express();
var port = process.env.PORT || 8080;

// App Configuration
app.set("views", __dirname + "/views");
app.set("view engine", "pug");
app.set("view options", {
  layout: false
});
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(function(req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST");
  res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, content-type, Authorization");
  next();
});
app.use(express.static(__dirname + "/public"));

// ROUTES
app.get("/",(req,res)=>{
    res.render("index");
});

app.listen(port,(err)=> {});

// more middleware (executes after routes)
// app.use(function(req, res, next) {
//     next()
// });

// error handling middleware
// app.use(function(err, req, res, next) {
//     next()
// });
