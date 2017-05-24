var dbcon = require('../db/redis-functions.js');
var checker = require('../lib/validateinput.js');
var Validator = new checker();


exports.getNotebook = function(request, response){
  if(Validator.validate_NotebookName(request.params.notebookname) === true){

    dbcon.getNotebook(request.auth.user, request.params.notebookname, function(error, result){
      if (error) {
        response.status(500).json({status: 'error', content: error});
      }
      else {
        response.status(200).json({status: 'ok', content: result});
      }
    })
  } else {
    response.status(400).json({status: 'error', content: 'no valid data'});
  }
};


exports.createOrUpdateNotebook = function(request, response){
  // exports function to notebook handling
  // creating and updating a notebook is the same here and run with post data
  // see payload attribute
  
  try {
    var input = {
      mail: request.auth.user,
      notebookname: request.params.notebookname,
      payload: JSON.parse(request.body.payload)
    };


    if(Validator.checkCreateOrUpdateNotebook(input) === true){
      dbcon.createOrUpdateNotebook(input, function(error, result){
        if (error) {
          response.status(400).json({status: 'error', content: error});
        }
        else {
          response.status(200).json({status: 'ok', content: 'notebook updated'});
        }
      })
    }
    else {
      response.status(400).json({status: 'error', content: 'no valid data'});
    }



  } catch (error){
      response.status(400).json({status: 'error', content: 'invalid json'});
  }

};


exports.deleteNotebook = function(request, response){
  if(Validator.validate_NotebookName(request.params.notebookname) === true){
    dbcon.deleteNotebook(request.auth.user, request.params.notebookname, function(error, result){
      if (error) {
        response.status(500).json({status: 'error', content: error});
      }
      else {
        response.status(200).json({status: 'ok', content: 'notebook deleted'});
      }
    })
  } else {
    response.status(400).json({status: 'error', content: 'no valid data'});
  }


};

