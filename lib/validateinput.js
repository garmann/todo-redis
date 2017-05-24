
module.exports = ValidateInput;

function ValidateInput(){
  /*
  this aims to be a simple validation
  - just exlucding certain characters
  - regexes are not perfect, they are not production ready
  */ 

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
      this.validate_password(userData.pass)
      ){

      return true;

    } else {
      return false;
    }
  };


  this.validate_NotebookName = function(input){
    // returns true (input ok) or false (input not ok)
    var allowedChars = /^[a-zA-Z0-9\.\-_]*$/;
    if (input.match(allowedChars) !== null && input.length >= 2 && input.length <= 100) {
      return true;
    }
    else {
      return false;
    }
  };


  this.checkCreateOrUpdateNotebook = function(input){
    if(
        this.validate_mail(input.mail) &&
        this.validate_NotebookName(input.notebookname)
      ){
        return true;

    } else {
        return false;
      }
  };


}


