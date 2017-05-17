var fs = require('fs');
var request = require('supertest');
describe('supertest: loading express', function () {

  var server;

  beforeEach(function () {
    server = require('../index');
  });

  afterEach(function () {
    server.close();
  });


  it('GET / should check first front page for basic json', function testSiteIndex(done) {
    request(server)
    .get('/')
    .expect(200)
    .expect(function(res){
      if (!JSON.parse(res.text).content === 'have fun!'){
        throw new Error('could not find content in json');
      }
      if (!JSON.parse(res.text).status === 'ok'){
        throw new Error('could not find status in json');
      }

    })
    .expect(200, done)
  });


  var testuser1 = {
    name: 'testuser',
    mail: 'test@test.de',
    password: 'xxxxxx'
  };

  // in empty system it will be 1
  // using this simple shortcut, api currently is not returning id :P
  var testuser1_id = 1;

  it('should create a new user', function testCreateUser(done){
    request(server)
    .post('/user')
    .send(testuser1)
    .expect(200)
    .expect(function(res){
      if (JSON.parse(res.text).content !== 'user created'){
        throw new Error('could not find content in json');
      }
      if (JSON.parse(res.text).status !== 'ok'){
        throw new Error('could not find status in json');
      }
    })
    .expect(200, done)
  });


  it('should try to add the same user again and fail', function testCreateUser(done){
    request(server)
    .post('/user')
    .send(testuser1)
    .expect(400)
    .expect(function(res){
      if (JSON.parse(res.text).content !== 'user not created'){
        throw new Error('could not find content in json');
      }
      if (JSON.parse(res.text).status !== 'error'){
        throw new Error('could not find status in json');
      }
    })
    .expect(400, done)
  });


  it('should check users list for testuser', function testUsersList(done){
    request(server)
    .get('/users/list')
    .expect(200)
    .expect(function(res){
      if (JSON.parse(res.text).content[0]  !== 'test@test.de'){
        throw new Error('could not find content in json');
      }
      if (JSON.parse(res.text).status !== 'ok'){
        throw new Error('could not find status in json');
      }
    })
    .expect(200, done)
  });


  it('should check user details', function testUsersList(done){
    request(server)
    .get('/user/' + testuser1_id)
    .auth(testuser1.mail, testuser1.password)
    .expect(200)
    .expect(function(res){
      if (JSON.parse(res.text).content.mail  !== 'test@test.de'){
        throw new Error('could not find content in json');
      }
      if (JSON.parse(res.text).status !== 'ok'){
        throw new Error('could not find status in json');
      }
    })
    .expect(200, done)
  });

  it('should check user details with wrong login data and fail', function testUsersList(done){
    request(server)
    .get('/user/' + testuser1_id)
    .auth(testuser1.mail, 'wrong-password')
    .expect(401, done)
  });

  it('should update user details', function testUsersList(done){
    request(server)
    .put('/user/' + testuser1_id)
    .auth(testuser1.mail, testuser1.password)
    .send(testuser1)
    .expect(200)
    .expect(function(res){
      if (JSON.parse(res.text).content  !== 'user was updated'){
        throw new Error('could not find content in json');
      }
      if (JSON.parse(res.text).status !== 'ok'){
        throw new Error('could not find status in json');
      }
    })
    .expect(200, done)
  });


  it('should delete user', function testUsersList(done){
    request(server)
    .delete('/user/' + testuser1_id)
    .auth(testuser1.mail, testuser1.password)
    .expect(200)
    .expect(function(res){
      if (JSON.parse(res.text).content  !== 'user was deleted'){
        throw new Error('could not find content in json');
      }
      if (JSON.parse(res.text).status !== 'ok'){
        throw new Error('could not find status in json');
      }
    })
    .expect(200, done)
  });


});