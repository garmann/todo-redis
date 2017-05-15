
module.exports = ValidateInput;

function ValidateInput(){

  this.validate_mail = function(input){
    // returns true (input ok) or false (input not ok)
    var allowedChars = /^[a-zA-Z0-9@\.\-_]*$/;
    if (input.match(allowedChars) !== null && input.length >= 5 && input.length <= 100) {
      return true;
    }
    else {
      return false;
    }

  };


  this.validate_name = function(input){
    // returns true (input ok) or false (input not ok)
    var allowedChars = /^[a-zA-Z0-9\.\-_]*$/;
    if (input.match(allowedChars) !== null && input.length >= 5 && input.length <= 100) {
      return true;
    }
    else {
      return false;
    }
  };


  this.validate_password = function(input){
    // returns true (input ok) or false (input not ok)
    var allowedChars = /^[a-zA-Z0-9@\.\-_]*$/;
    if (input.match(allowedChars) !== null && input.length >= 5 && input.length <= 100) {
      return true;
    }
    else {
      return false;
    }
  };


  this.validate_activationlink = function(input){
    // returns true (input ok) or false (input not ok)
    var allowedChars = /^[0-9_]*$/;
    if (input.match(allowedChars) !== null && input.length >= 5 && input.length <= 100) {
      return true;
    }
    else {
      return false;
    }
  };


  this.checkInputUserData = function(userData){
    if (
      this.validate_mail(userData.mail) && 
      this.validate_name(userData.name) && 
      this.validate_password(userData.pwhash)
      ){

      return true;

    } else {
      return false;
    }
  };


}


