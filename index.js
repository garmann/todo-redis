var express = require('express'), 
    cors = require('cors');
var bodyParser = require('body-parser');
var app = express();

var auth = require('./lib/basicauth');
var site = require('./api/site.js');
var user = require('./api/user.js');
var notebook = require('./api/notebook.js');


app.use(bodyParser.json());
app.use(cors());


// general requests
app.get('/', site.index);

// user requests
app.get('/users/list', user.userlist);

app.get('/user/activation/:link', auth.manageBasicAuth(), user.activateUser);

app.post('/user', user.createuser);
app.get('/user/:userid', auth.manageBasicAuth(), user.getUserData);
app.put('/user/:userid', auth.manageBasicAuth(), user.updateUser);
app.delete('/user/:userid', auth.manageBasicAuth(), user.deleteUser);


// notebook requests


var server = app.listen(3001, function(){
  console.log("startup express");
});

module.exports = server;
