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
// app.get('/user', auth.manageBasicAuth(), user.getUserId);

app.get('/user', auth.manageBasicAuth(), user.getUserData);
app.put('/user', auth.manageBasicAuth(), user.updateUser);
app.delete('/user', auth.manageBasicAuth(), user.deleteUser);


// notebook requests

app.get('/notebook/:userid/:notebookname', auth.manageBasicAuth(), notebook.getNotebook)
app.delete('/notebook/:userid/:notebookname', auth.manageBasicAuth(), notebook.deleteNotebook);

// notebook items requests
app.post('/notebook/:userid/:notebookname', auth.manageBasicAuth(), notebook.createOrUpdateNotebook);



var server = app.listen(3001, function(){
  console.log("startup express");
});

module.exports = server;
