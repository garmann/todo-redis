var redis = require('redis'), client = redis.createClient();
var bcrypt = require('bcrypt');
var logger = require('../lib/logger');

client.on("error", function (err) {
    console.log("Error " + err);
    process.exit(1);
});


module.exports = RedisLowLevel;

function RedisLowLevel(){
  /*
    This function takes out the low level function handling from redis client.
  */


  /*
  salt...
    var salt = bcrypt.genSaltSync(10);
  */
  var salt = '$2a$10$VQC8NhUiZNMQmnIkDw7sXe';


  this.getUserList = function(){
    // gets all users from redis
    return new Promise(
      function(resolve, reject){
        client.HKEYS('user_list', function(error, result){
          logger.debug('getUserList', result);
          if (error) reject(error);
          else resolve(result);
        });
      }
    );
  };


  this.userExists = function(userData){
    // checks if given user exists in db
    return new Promise(
      function(resolve, reject){
        client.HEXISTS('user_list', userData.mail, function(error, result){
          logger.debug('userExists', userData.mail, result);
          if (error) reject('redis error')
          else if ( result === 1 ) reject('user already present in db')
          else resolve('user not found')
        });
      }
    );
  };


  this.getNewUserId = function(){
    // incr userid counter and returns new id
    // counter is representing current used id
    return new Promise(
      function(resolve, reject){
        client.INCR('next_user_id',function(error, result){
          logger.debug('getNewUserId', result);
          if (error) reject(error);
          else resolve(result);
        });
      }
    );
  };


  this.addUser2UserList = function(userData, newUserId){
    // adds to user_list
    // user_list is a mapping from mailaddress to userid in database
    return new Promise(
      function(resolve, reject){
        client.HSET('user_list', userData.mail, newUserId, function(error, result){
          logger.debug('addUser2UserList', userData.mail, newUserId, result);
          if (error) reject(error);
          else resolve(result);
        });
      }
    );
  };


  this.addUser2Users = function(userData, newUserId){
    // will create new user into database
    return new Promise(
      function(resolve, reject){

        var newUserDatabaseId = 'user:' + newUserId;

        var newUserData = {
          mail: userData.mail,
          name: userData.name,
          status: 0,
          pwhash: bcrypt.hashSync(userData.pass, salt)
        }

        client.HMSET(newUserDatabaseId, newUserData, function(error, result){
          logger.debug('addUser2Users', newUserDatabaseId, newUserData, result);
          if (error) reject(error);
          else resolve(result);
        });
      }
    );
  };


  this.update2Users = function(userData, newUserId){
    // update a user for given userData
    return new Promise(
      function(resolve, reject){
        var newUserDatabaseId = 'user:' + newUserId;

        var newUserData = {
          mail: userData.mail,
          name: userData.name,
          pwhash: bcrypt.hashSync(userData.pass, salt)
        }

        client.HMSET(newUserDatabaseId, newUserData, function(error, result){
          logger.debug('update2Users', newUserDatabaseId, newUserData, result);
          if (error) reject(error);
          else resolve(result);
        });
      }
    );
  };


  this.addActivationLink = function(userData){
    /*
    adds an activation string to redis
    this is needed for account valiation
    i simply log the url to console (usally done via mail sendout / mail api like mailgun)
    */
    return new Promise(
      function(resolve, reject){
        var randomInt = parseInt(Math.random() * (100000 - 100 ) + 100);
        var timestamp = new Date().getTime();
        var activationString = randomInt + '_' + timestamp;

        client.HSET('activation_link', activationString, userData.mail, function(error, result){
          logger.debug('addActivationLink', activationString, userData.mail, result);
          if (error) reject(error);
          else {
            console.log('XX ACTIVATION_LINK: http://localhost:3001/user/activation/' + activationString);
            resolve(result);
          } 
            
        });
      }
    );
  };


  this.removeActivationLink = function(link){
    // removes activation string from db
    // this is used in account validation process
    return new Promise(
      function(resolve, reject){
        client.HDEL('activation_link', link, function(error, result){
          logger.debug('removeActivationLink', link, result);
          if (error) reject(error);
          else if (result === 1) resolve(result);
          else reject('expected other result: ' + result);
        });
      }
    );
  };


  this.getUserIdFromMail = function(mail){
    // returns userid for a given mailaddress
    return new Promise(
      function(resolve, reject){
        client.HGET('user_list', mail, function(error, result){
          logger.debug('getUserIdFromMail', mail, result);
          if (error) return reject(error);
          else if (result !== null) resolve(result);
          else reject('cloud not find user');
        });
      }
    );
  };


  this.checkForActivationLink = function(link){
    // checks for link and returns mailaddress if found in db
    // or this promise will be rejected
    return new Promise(
      function(resolve, reject){
        client.HGET('activation_link', link, function(error, result){
          logger.debug('checkForActivationLink', link, result);
          if (error) reject(error);
          else if (result !== null) resolve(result);
          else reject('activation link not found');
        });
      }
    );
  };


  this.setUserStatus = function(userid, userstatus){
    // sets user status to a given value
    // 0 = not active
    // 1 = active
    return new Promise(
      function(resolve, reject){
        var userkey = 'user:' + userid;
        client.HSET(userkey, 'status', userstatus, function(error, result){
          logger.debug('setUserStatus', userkey, userstatus, result);
          if (error) reject(error);
          else resolve(result);
        });
      }
    );
  };


  this.isUserActive = function(userid){
    // returns user status for a given userid as promise
    // 0 = not active
    // 1 = active

    return new Promise(
      function(resolve, reject){
        var userkey = 'user:' + userid;
        client.HGET(userkey, 'status', function(error, result){
          logger.debug('isUserActive', userid, result);
          if (error) reject(error);
          else if (result === '0') reject('user not active')
          else if (result === '1') resolve('user is active')
          else reject('user not found or other status')
        });
      }
    );
  };


  this.getSalt = function(userid){
    // returns hashed pw from db for given userid
    return new Promise(
      function(resolve, reject){
        var userkey = 'user:' + userid;
        client.HGET(userkey, 'pwhash', function(error, result){
          logger.debug('getSalt', userkey, result);
          if (error) reject(error);
          else if (result !== null) resolve(result);
          else reject('user or hash not found');
        });
      }
    );
  };


  this.getUserData = function(userid){
    // returns user data from db for given userid
    return new Promise(
      function(resolve, reject){
        var userkey = 'user:' + userid;
        client.HGETALL(userkey, function(error, result){
          logger.debug('getUserData', userkey, result);
          if (error) reject(error);
          else if (result !== null) {
            delete result.pwhash;
            result.userid = userid;
            resolve(result);
          }
          else reject('user or hash not found');
        });
      }
    );
  };


  this.deleteFromUserList = function(mail){
    // deletes from user_list for given userid
    return new Promise(
      function(resolve, reject){
        client.HDEL('user_list', mail, function(error, result){
          logger.debug('deleteFromUserList', mail, result);
          if (error) reject(error);
          else if (result !== null) {resolve(result)}
          else reject('user not found');
        });
      }
    );
  };


  this.deletefromUsers = function(userid){
    // deletes from user:ID for given userid
    return new Promise(
      function(resolve, reject){
        var userkey = 'user:' + userid;
        client.DEL(userkey, function(error, result){
          logger.debug('deletefromUsers', userkey, result);
          if (error) reject(error);
          else if (result === 1) {resolve(result)}
          else reject('user not found');
        });
      }
    );
  };


  this.getMailFromUserId = function(userid){
    // returns mail for given userid
    return new Promise(
      function(resolve, reject){
        var userkey = 'user:' + userid;
        client.HGET(userkey, 'mail', function(error, result){
          logger.debug('getMailFromUserId', userkey, result);
          if (error) reject(error);
          else if (result !== null) {resolve(result)}
          else reject('user not found');
        });
      }
    );
  };


  this.createOrUpdateNotebook = function(userid, inputObject){
    // add a notebook to db, always the while dataset is rewritten
    return new Promise(
      function(resolve, reject){
        var notebookname_key = 'notebook:' + userid + ':' + inputObject.notebookname;

        client.HMSET(notebookname_key, inputObject.payload, function(error, result){
          logger.debug('createOrUpdateNotebook', notebookname_key, inputObject.payload, result);
          if (error) reject(error);
          else resolve('notebook updated');
        });
      }
    );
  };


  this.deleteNotebook = function(userid, notebookname){
    // removes a single notebookbook for given userid and notebookname
    return new Promise(
      function(resolve, reject){
        var notebookname_key = 'notebook:' + userid + ':' + notebookname;

        client.DEL(notebookname_key, function(error, result){
          logger.debug('deleteNotebook', notebookname_key, result);
          if (error) reject(error);
          else resolve('notebook deleted');
        });
      }
    );
  };


  this.getNotebook = function(userid, notebookname){
    // simply returns notebookdata as promise
    return new Promise(
      function(resolve, reject){
        var notebookname_key = 'notebook:' + userid + ':' + notebookname;

        client.HGETALL(notebookname_key, function(error, result){
          logger.debug('getNotebook', notebookname_key, result);
          if (error) reject(error);
          else if (result !== null) resolve(result);
          else reject('notebook not found');
        });
      }
    );
  };

}