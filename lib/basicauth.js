var dbcon = require('../db/redis-functions.js');
var basicAuth = require('express-basic-auth');
var bcrypt = require('bcrypt');
var checker = require('./validateinput');
var Validator = new checker();
var logger = require('./logger');


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
    if(Validator.validate_mail(username) === true){
      dbcon.getSalt(username, function(error, result){
        logger.debug('myAuthorizer', username, result)
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
    } else {
      callback('error', false);
    }


}

function getUnauthorizedResponse(req) {
    return req.auth ?
        ('Credentials ' + req.auth.user + ':' + req.auth.password + ' rejected') :
        'No credentials provided'
}

