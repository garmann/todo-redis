var RedisLowLevel = require('./redis-lowlevel.js');
var redisDB = new RedisLowLevel();


exports.getUserList = function(callback){
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


exports.createUser = function(userData, callback){
  if(typeof callback !== 'function') {
    throw Error('this is not a callback');
  }

  redisDB.userExists(userData)
  .then(redisDB.getNewUserId)
  .then(newid => {
    redisDB.addUser2UserList(userData, newid);
    return newid;
  })
  .then(newid => {redisDB.addUser2Users(userData, newid)})
  .then(newid => {redisDB.addActivationLink(userData)})
  .then(() => {callback(null, 'success')})
  .catch(
    reject => {
      console.log('XX-ERROR', reject);
      callback(reject);
  })

};


exports.activateUser = function(link, callback){
  if(typeof callback !== 'function') {
    throw Error('this is not a callback');
  }

  redisDB.checkForActivationLink(link)
  .then(mail => { return redisDB.getUserIdFromMail(mail)})
  .then(userid => {redisDB.setUserStatus(userid, 1)})
  .then(() => {redisDB.removeActivationLink(link)})
  .then(() => {callback(null, 'success')})
  .catch(
    reject => {
      console.log('XX-ERROR', reject);
      callback(reject);
    }
  )

};


exports.getSalt = function(mail, callback){
  if(typeof callback !== 'function') {
    throw Error('this is not a callback');
  }

  redisDB.getUserIdFromMail(mail)
  .then(userid => {return redisDB.getSalt(userid)})
  .then(salt => {callback(null, salt)})
  .catch(
    reject => {
      console.log('XX-ERROR', reject);
      callback(reject);
    }
  )
};


exports.deleteUser = function(userid, callback){
  if(typeof callback !== 'function') {
    throw Error('this is not a callback');
  }

  redisDB.getMailFromUserId(userid)
  .then(mail => {redisDB.deleteFromUserList(mail)})
  .then(() => {redisDB.deletefromUsers(userid)})
  .then(() => {callback(null, userid)})
  .catch(
    reject => {
      console.log('XX-ERROR', reject);
      callback(reject);
    }
  )
};


exports.getUserData = function(userid, callback){
  if(typeof callback !== 'function') {
    throw Error('this is not a callback');
  }

  redisDB.getUserData(userid).then(
    function(resolve){ callback(null, resolve) },
    function(reject){ callback(reject) }
  )
};


exports.updateUser = function(userid, userData, callback){
  if(typeof callback !== 'function') {
    throw Error('this is not a callback');
  }

  redisDB.getMailFromUserId(userid)
  .then(mailToBeDeleted => {redisDB.deleteFromUserList(mailToBeDeleted)})
  .then(() => {redisDB.addUser2UserList(userData, userid)})
  .then(() => {redisDB.update2Users(userData, userid)})
  .then(() => {callback(null, userid)})
  .catch(
    reject => {
      console.log('XX-ERROR', reject);
      callback(reject);
    }
  )

};
