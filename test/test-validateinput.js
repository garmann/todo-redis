var chai = require('chai');
var should = chai.should();

var checker = require('../lib/validateinput');
var ValidateInput = new checker();

describe('check ValidateInput from lib/validateinput.js', function(){

  it('should check if validate_mail returns true', function(){
    ValidateInput.validate_mail('test@test.de').should.be.true;
  });

  it('should check if validate_mail returns false with ;', function(){
    ValidateInput.validate_mail('test@tes;t.de').should.be.false;
  });

  xit('should check if validate_mail returns false without @', function(){
    ValidateInput.validate_mail('testtest.de').should.be.false;
  });




  it('should check if validate_name returns true', function(){
    ValidateInput.validate_name('paulchen').should.be.true;
  });

  it('should check if validate_name returns false with ;', function(){
    ValidateInput.validate_name('testes;t.de').should.be.false;
  });




  it('should check if validate_password returns true', function(){
    ValidateInput.validate_password('adshfdf').should.be.true;
  });

  it('should check if validate_password returns false with ;', function(){
    ValidateInput.validate_password('fhjds;jdf').should.be.false;
  });





  it('should check if validate_activationlink returns true', function(){
    ValidateInput.validate_activationlink('32890_9876').should.be.true;
  });

  it('should check if validate_activationlink returns false with wrong chars', function(){
    ValidateInput.validate_activationlink('r43r43r_ddsa').should.be.false;
  });

  it('should check if validate_activationlink returns false with ;', function(){
    ValidateInput.validate_activationlink('3289;0_9876').should.be.false;
  });


  var user1 = {
    mail: 'bla@bla.de',
    name: 'paule',
    pass: 'pwhash'
  };
  var user2 = {
    mail: 'bla2@bla;2.de',
    name: 'paule2',
    pass: 'pwhash2'
  };


  it('should check if checkInputUserData returns true with correct data', function(){
    ValidateInput.checkInputUserData(user1).should.be.true;
  });

  it('should check if checkInputUserData returns false with wrong data', function(){
    ValidateInput.checkInputUserData(user2).should.be.false;
  });

});
