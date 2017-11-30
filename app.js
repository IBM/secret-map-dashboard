var express = require('express');
var app = express();

app.use(express.static(__dirname + '/public'));

var port = process.env.PORT || 8080;

app.get('/',(req,res)=>{
    res.sendFile(__dirname + '/public/index.html');
})

app.listen(port, (err) => {
    console.log("To view your app, open this link in your browser: http://localhost:" + port);
});