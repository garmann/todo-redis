var RedisLowLevel = require('./redis-lowlevel.js');
var redisDB = new RedisLowLevel();

module.exports = RedisFunctions;

function RedisFunctions(){
  /*
    This function takes out the logic from main index.js. 
  */

  this.getUserList = function(callback){
    if(typeof callback !== 'function') {
      throw Error('this is not a callback');
    }

    redisDB.getUserList().then(
      function(resolve){
        callback(null, resolve);
      },
      function(reject){
        callback(1, reject);
      }
    );
  };


  this.createUser = function(userData, callback){
    if(typeof callback !== 'function') {
      throw Error('this is not a callback');
    }

    console.log(0, userData);

    redisDB.userExists(userData)

    .then(redisDB.getNewUserId)

    .then((newid) => {
        redisDB.addUser2UserList(userData, newid);
        return newid;
      }
    )

    .then((newid) => {
        redisDB.addUser2Users(userData, newid);
      }
    )

    .catch(
      (reject) => {
        console.log('XX-ERROR', reject, 'cloud not create user')
        callback(1, reject);
      }
    )
  };



}

