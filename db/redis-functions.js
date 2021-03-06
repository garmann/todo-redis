var RedisLowLevel = require('./redis-lowlevel.js');
var redisDB = new RedisLowLevel();


exports.getUserList = function(callback){
  /* 
  uses promise from reids-lowlevel to grab data
  runs the callback which sends back data to client
  */

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
  /*
  describes the process of creating a user with request postdata
  will generate an activation link, currently send to console.log
  after all async work is done, callback for response will be run
  */

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
  // describe process of validating a new useraccount
  // will run callback for repsonse handling

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
  // used from lib/baiscauth to compare password hashed
  //  from database and the data send by user
  // grabs salt for given mail
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


exports.deleteUser = function(mail, callback){
  // describes process of removing a given user from database
  // will run callback for response handling

  if(typeof callback !== 'function') {
    throw Error('this is not a callback');
  }

  redisDB.getUserIdFromMail(mail)
  .then(userid => {redisDB.deletefromUsers(userid)})
  .then(() => {redisDB.deleteFromUserList(mail)})
  .then(() => {callback(null, mail)})
  .catch(
    reject => {
      console.log('XX-ERROR', reject);
      callback(reject);
    }
  )
};


exports.getUserData = function(mail, callback){
  // process of sending back userdata
  // callback will be run for response handling

  if(typeof callback !== 'function') {
    throw Error('this is not a callback');
  }

  redisDB.getUserIdFromMail(mail)
  .then(userid => redisDB.getUserData(userid))
  .then(
    function(resolve){ callback(null, resolve) },
    function(reject){ callback(reject) }
  )
};


exports.updateUser = function(mail, userData, callback){
  /*
  describe process of updating all userdata
  a user have to login with existing data
  post data will be used as new data
  */
  if(typeof callback !== 'function') {
    throw Error('this is not a callback');
  }

  redisDB.getUserIdFromMail(mail)
  .then(userid => {
    redisDB.deleteFromUserList(mail);
    return userid;
  })
  .then(userid => {redisDB.addUser2UserList(userData, userid)})
  .then(userid => {redisDB.update2Users(userData, userid)})
  .then(userid => {callback(null, userid)})
  .catch(
    reject => {
      console.log('XX-ERROR', reject);
      callback(reject);
    }
  )
};


exports.getUserId = function(mail, callback){
  // returns userid from db for a given mailaddress
  // and runs callback to send data back to client
  if(typeof callback !== 'function') {
    throw Error('this is not a callback');
  }

  redisDB.getUserIdFromMail(mail)
  .then(userid => {callback(null, userid)})
  .catch(
    reject => {
      console.log('XX-ERROR', reject);
      callback(reject);
    }
  )
};


exports.createOrUpdateNotebook = function(inputObject, callback){
  if(typeof callback !== 'function') {
    throw Error('this is not a callback');
  }

  redisDB.getUserIdFromMail(inputObject.mail)
  .then(userid => {redisDB.isUserActive(userid)})
  .then(userid => {redisDB.deleteNotebook(userid, inputObject.notebookname)})
  .then(userid => {return redisDB.createOrUpdateNotebook(userid, inputObject)})
  .then(userid => {callback(null, userid)})
  .catch(
    reject => {
      console.log('XX-ERROR', reject);
      callback(reject);
    }
  )
};


exports.deleteNotebook = function(mail, notebookname, callback){
  // describe process of deleting a notebook
  // runs a callback for response handling
  
  if(typeof callback !== 'function') {
    throw Error('this is not a callback');
  }

  redisDB.getUserIdFromMail(mail)
  .then(userid => {redisDB.isUserActive(userid)})
  .then(userid => {redisDB.deleteNotebook(userid, notebookname)})
  .then(userid => {callback(null, userid)})
  .catch(
    reject => {
      console.log('XX-ERROR', reject);
      callback(reject);
    }
  )
};


exports.getNotebook = function(mail, notebookname, callback){
  // describes process of returning notebook data
  // will run callback to response handling

  if(typeof callback !== 'function') {
    throw Error('this is not a callback');
  }

  redisDB.getUserIdFromMail(mail)
  .then(userid => {redisDB.isUserActive(userid)})
  .then(userid => {return redisDB.getNotebook(userid, notebookname)})
  .then(result => {callback(null, result)})
  .catch(
    reject => {
      console.log('XX-ERROR', reject);
      callback(reject);
    }
  )
};

