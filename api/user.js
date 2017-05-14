var db = require('../db/redis-functions.js');
var dbcon = new db();


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
      - activation link
  */
  var u1 = {
    mail: 'bla@bla.de',
    name: 'paule',
    status: 0,
    pwhash: 'pwhash'
  };
  var u2 = {
    mail: 'bla2@bla2.de',
    name: 'paule2',
    status: 0,
    pwhash: 'pwhash2'
  };

  dbcon.createUser(u1, function(error, result){
    if (error) {
      console.log('ERROR:', error);
    }
    else {
      console.log('userok u1', result);
    }
  });


  dbcon.createUser(u2, function(error, result){
    if (error) {
      console.log('ERROR:', error);
    }
    else {
      console.log('userok u2', result);
    }
  });


  response.status(200).json({status: 'ok', content: 'testing...'});


};


exports.activateUser = function(){
  /*
  checks if user exists & is status = 0
  if link is okay; then change status
  */
};


exports.updateUser = function(){

};
/*
  update user:
    - when mail changed : remove from used_mail, add new
      - if possible redis inplace update
*/

