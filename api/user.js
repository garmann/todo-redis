var dbcon = require('../db/redis-functions.js');
var checker = require('../lib/validateinput.js');
var Validator = new checker();


exports.userlist = function(request, response){
  /*
    will respond a baisc userlist to client from database
  */

  dbcon.getUserList(function(error, result){

    if (error) {
      response.status(500).json({status: 'error', content: 'null'});
    }
    else {
      response.status(200).json({status: 'ok', content: result});
    }
  });
};


exports.getUserId = function(request, response){
  // will respond with userid for a given mailaddress from logindata
  dbcon.getUserId(request.auth.user, function(error, result){
    if (error) {
      response.status(404).json({status: 'error', content: 'null'});
    }
    else {
      response.status(200).json({status: 'ok', content: result});
    }
  });
};


exports.createuser = function(request, response){
  /*
  for given post data a user will be created in database
  and an acitvation link will be posted to console.log
  */

  var input = {
    mail: request.body.mail,
    name: request.body.name,
    pass: request.body.password

  };

  if (Validator.checkInputUserData(input) === true) {

    dbcon.createUser(input, function(error, result){
      if (error) {
        response.status(400).json({status: 'error', content: 'user not created'});
      }
      else {
        response.status(200).json({status: 'ok', content: 'user created'});
      }
    });

  } else {
    response.status(400).json({status: 'error', content: 'invalid input'});
  }
};


exports.activateUser = function(request, response){
  /*
  checks if user exists & is status = 0
  if link is okay; then change status
  */
  if(Validator.validate_activationlink(request.params.link)){
    var link = request.params.link;

    dbcon.activateUser(link, function(error, result){
      if (error) {
        response.status(500).json({status: 'error', content: 'could not validate user'});
      }
      else {
        response.status(200).json({status: 'ok', content: 'user is now active'});
      }
    });
  } 

  else {
    response.status(400).json({status: 'error', content: 'activationlink not valid'});
  }
};


exports.deleteUser = function(request, response){
  // exports function for user deletion process
  dbcon.deleteUser(request.auth.user, function(error, result){
    if (error) {
      response.status(500).json({status: 'error', content: 'could not delete user'});
    }
    else {
      response.status(200).json({status: 'ok', content: 'user was deleted'});
    }
  });
};


exports.getUserData = function(request, response){
  // exports function for sending userdata 
  dbcon.getUserData(request.auth.user, function(error, result){
    if (error) {
      response.status(500).json({status: 'error', content: 'no such user'});
    }
    else {
      response.status(200).json({status: 'ok', content: result});
    }
  });
};


exports.updateUser = function(request, response){
  /*
    fields allowed to update from this function(triggered from user):
    - name
    - mail
    - password

    -> current (simple) implementation: 
      send all fields, which will update all fields
  */
  
  var input = {
    mail: request.body.mail,
    name: request.body.name,
    pass: request.body.password

  };

  if (Validator.checkInputUserData(input) === true) {

    dbcon.updateUser(request.auth.user, input, function(error, result){

      if (error) {
        response.status(400).json({status: 'error', content: 'user not updated'});
      }
      else {
        response.status(200).json({status: 'ok', content: 'user was updated'});
      }
    });

  } else {
    response.status(400).json({status: 'error', content: 'invalid input'});
  }

};






