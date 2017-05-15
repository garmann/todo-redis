var redis = require('redis'), client = redis.createClient();
var bcrypt = require('bcrypt');

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
    // gets all users
    return new Promise(
      function(resolve, reject){
        client.HKEYS('user_list', function(error, result){
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
          if (error) reject('redis error')
          else if ( result === 1 ) reject('user already present in db')
          else resolve('user not found')
        });
      }
    );
  };


  this.getNewUserId = function(){
    // incr userid counter and returns new id
    return new Promise(
      function(resolve, reject){
        client.INCR('next_user_id',function(error, result){
          if (error) reject(error);
          else resolve(result);
        });
      }
    );
  };


  this.addUser2UserList = function(userData, newUserId){
    // adds to user_list
    return new Promise(
      function(resolve, reject){
        client.HSET('user_list', userData.mail, newUserId, function(error, result){
          if (error)  reject(error);
          else resolve(result);
        });
      }
    );
  };


  this.addUser2Users = function(userData, newUserId){
    // add to user:id...
    return new Promise(
      function(resolve, reject){

        var newUserDatabaseId = 'user:' + newUserId;

        var newUserData = {
          mail: userData.mail,
          name: userData.name,
          status: 0,
          pwhash: bcrypt.hashSync(userData.pwhash, salt)
        }

        client.HMSET(newUserDatabaseId, newUserData, function(error, result){
          if (error) reject(error);
          else resolve(result);
        });
      }
    );
  };


  this.addActivationLink = function(userData){
    return new Promise(
      function(resolve, reject){
        var randomInt = parseInt(Math.random() * (100000 - 100 ) + 100);
        var timestamp = new Date().getTime();
        var activationString = randomInt + '_' + timestamp;

        client.HSET('activation_link', activationString, userData.mail, function(error, result){
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
    return new Promise(
      function(resolve, reject){
        client.HDEL('activation_link', link, function(error, result){
          console.log('removeActivationLink', result, link);

          if (error) reject(error);
          else if (result === 1) resolve(result);
          else reject('expected other result: ' + result);
        });
      }
    );
  };


  this.getUserIdFromMail = function(mail){
    // finds userid with a mailaddress
    return new Promise(
      function(resolve, reject){
        client.HGET('user_list', mail, function(error, result){
          console.log('getUserIdFromMail', result, mail);

          if (error) return reject(error);
          else if (result !== null) resolve(result);
          else reject('expected other result: ' + result);
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
          console.log('checkForActivationLink', result, link);

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

        console.log('setUserStatus', userid, userstatus);

        client.HSET(userkey, 'status', userstatus, function(error, result){
          if (error) reject(error);
          else resolve(result);
        });
      }
    );
  };


}