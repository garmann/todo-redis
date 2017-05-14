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

  it('(GET /) should check first front page for basic json', function testSiteIndex(done) {
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

});