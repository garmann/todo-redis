var dbcon = require('../db/redis-functions.js');
var checker = require('../lib/validateinput.js');
var Validator = new checker();


exports.getNotebook = function(request, response){
  dbcon.getNotebook(request.auth.user, request.params.notebookname, function(error, result){
    if (error) {
      response.status(500).json({status: 'error', content: error});
    }
    else {
      response.status(200).json({status: 'ok', content: result});
    }
  })
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

    dbcon.createOrUpdateNotebook(input, function(error, result){
      if (error) {
        response.status(400).json({status: 'error', content: error});
      }
      else {
        response.status(200).json({status: 'ok', content: 'notebook updated'});
      }
    })

  } catch (error){
      response.status(400).json({status: 'error', content: 'invalid json'});
  }

};


exports.deleteNotebook = function(request, response){
  dbcon.deleteNotebook(request.auth.user, request.params.notebookname, function(error, result){
    if (error) {
      response.status(500).json({status: 'error', content: error});
    }
    else {
      response.status(200).json({status: 'ok', content: 'notebook deleted'});
    }
  })
};

