var express = require('express')
var app = express()
var port = 3000;
 
app.get('/', function (req, res) {
  res.send('Hello World')
})
 
app.listen(port,(req,res)=>{
    console.log('connect sucessfully, lisening to '+port);
})