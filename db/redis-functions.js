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

    redisDB.userExists(userData)

    .then(redisDB.getNewUserId)

    .then(newid => { 
        redisDB.addUser2UserList(userData, newid);
        return newid;
    })

    .then(newid => { redisDB.addUser2Users(userData, newid); })

    .then(newid => { redisDB.addActivationLink(userData); })

    .then(() => { callback(null, 'success') })

    .catch(
      reject => {
        console.log('XX-ERROR', reject)
        callback(reject);
    })

  };


  this.activateUser = function(link, callback){
    if(typeof callback !== 'function') {
      throw Error('this is not a callback');
    }

    redisDB.checkForActivationLink(link)

    .then(mail => { return redisDB.getUserIdFromMail(mail); })

    .then(userid => { redisDB.setUserStatus(userid, 1); })

    .then(() => { redisDB.removeActivationLink(link); })

    .then(() => { callback(null, 'success') })

    .catch(
      reject => {
        console.log('XX-ERROR', reject)
        callback(reject, 1);
      }
    )

  };



}

