let express = require("express");
let app = express();

app.use(express.static(__dirname + "/public"));

let port = process.env.PORT || 8080;

app.get("/", (req, res)=>{
  res.sendFile(__dirname + "/public/index.html");
});

app.listen(port, ()=> {
  console.log("To view your app, open this link in your browser: http://localhost:" + port); // eslint-disable-line
});
