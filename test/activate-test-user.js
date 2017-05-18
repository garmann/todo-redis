var RedisLowLevel = require('../db/redis-lowlevel.js');
var redisDB = new RedisLowLevel();


exports.activateUser = function(userid){
  redisDB.setUserStatus(userid, 1)
  .then(
    function(resolve){
      console.log('activateUser success', resolve);
    },
    function(reject){
      console.log('1activateUser failed', reject);
    }
  )
};

