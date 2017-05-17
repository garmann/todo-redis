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




});