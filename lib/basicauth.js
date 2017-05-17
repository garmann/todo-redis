var dbcon = require('../db/redis-functions.js');
var basicAuth = require('express-basic-auth');
var bcrypt = require('bcrypt');


exports.manageBasicAuth = function(){

  return basicAuth({ 
      authorizer: myAuthorizer,
      authorizeAsync: true, 
      challenge: true, 
      realm: 'partyparty', 
      unauthorizedResponse: getUnauthorizedResponse
      
  })
}


function myAuthorizer(username, password, callback) {

    dbcon.getSalt(username, function(error, result){

      if (error) {
        callback(null, false);
      } else {

        if (bcrypt.compareSync(password, result)) {
          callback(null, true);
        } else {
          callback(null, false);
        }
      }
    });
}

function getUnauthorizedResponse(req) {
    return req.auth ?
        ('Credentials ' + req.auth.user + ':' + req.auth.password + ' rejected') :
        'No credentials provided'
}

