var redis = require('redis'), client = redis.createClient();

client.on("error", function (err) {
    console.log("Error " + err);
});


module.exports = RedisLowLevel;

function RedisLowLevel(){
  /*
    This function takes out the low level function handling from redis client.
  */


  this.getUserList = function(){
    // gets all users
    return new Promise(
      function(resolve, reject){
        client.HKEYS('user_list', function(error, result){
          if (error) return reject(error);
          else return resolve(result);
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
          if (error) return reject(error);
          else return resolve(result);
        });
      }
    );
  };


  this.addUser2UserList = function(userData, newUserId){
    // adds to user_list
    return new Promise(
      function(resolve, reject){
        client.HSET('user_list', userData.mail, newUserId, function(error, result){
          if (error) return reject(error);
          else return resolve(result);
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
          pwhash: userData.pwhash
        }

        client.HMSET(newUserDatabaseId, newUserData, function(error, result){
          if (error) return reject(error);
          else return resolve(result);
        });
      }
    );
  };

}