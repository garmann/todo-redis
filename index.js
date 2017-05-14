var express = require('express'), cors = require('cors');
var bodyParser = require('body-parser');

var app = express();


var site = require('./api/site.js');
var user = require('./api/user.js');
var notebook = require('./api/notebook.js');


app.use(bodyParser.json());
app.use(cors());


// general requests
app.get('/', site.index);

// user requests
app.get('/userlist', user.userlist);
app.post('/user', user.createuser);

/*
new:
GET /user/:id/
PUT /user/:id/
DELETE /user/:id/

*/

// notebook requests


var server = app.listen(3001, function(){
  console.log("startup express");
});

module.exports = server;