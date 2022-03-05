const express = require('express')
  , engine = require('ejs-locals')
  , server = express()
  , mongodb = require("./mongodb");

const bodyParser = require("body-parser");

const normalrouter = require("./controllers/normal");

server.engine('ejs', engine);
mongodb.connect();

server.set('view engine', 'ejs');
server.set('views',__dirname + '/views');

server.listen(3000, ()=>{
    console.log("Server listening at 3000");
})

server.use(bodyParser.json());

server.use("/",normalrouter);

server.use('/',(req, res)=>{
    res.render('register',{user :{type: 'admin'}});
})