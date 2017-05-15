var db = require('../db/redis-functions.js');
var dbcon = new db();
var checker = require('../lib/validateinput.js');
var Validator = new checker();


exports.userlist = function(request, response){
  dbcon.getUserList(function(error, result){

    if (error) {
      console.log('ERROR:', error);
      response.status(500).json({status: 'error', content: 'null'});
    }
    else {
      response.status(200).json({status: 'ok', content: result});
    }
  });
};


exports.createuser = function(request, response){
  /*
  workflow:
    register user:
      ok - check for user_list
      ok - incr next_user_id
      ok - add to user_list (with new id)
      ok - use next_user_id and add data to:
      ok   - user_list
      ok  - user:100
      ok    - all post data
      ok - activation link
      ok - reponse ok
  */
  var u1 = {
    mail: 'bla@bla.de',
    name: 'paule',
    pwhash: 'pwhash'
  };
  var u2 = {
    mail: 'bla2@bla;2.de',
    name: 'paule2',
    pwhash: 'pwhash2'
  };

  if (Validator.checkInputUserData(u1) === true) {

    dbcon.createUser(u1, function(error, result){

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

  /*
  workflow:
    ok - checks for activation link in db
    ok - get userid from mail
    ok - change user status in db
    ok - remove link in db
  */

  if(Validator.validate_activationlink(request.params.link)){
    var link = request.params.link;

    dbcon.activateUser(link, function(error, result){
      if (error) {
        response.status(500).json({status: 'error', content: 'could not validate user'});
      }
      else {
        response.status(200).json({status: 'ok', content: 'user was validated'});
      }
    });
  } 

  else {
    response.status(400).json({status: 'error', content: 'activationlink not valid'});
  }


};


exports.updateUser = function(){
  /*
    update user:
      - when mail changed : remove from used_mail, add new
        - if possible redis inplace update
  */
};




