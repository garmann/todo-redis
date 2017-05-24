exports.index = function(request, response){
  /*
    exports static function as a project start
  */
  response.status(200).json({status: 'ok', content: 'have fun!'});
};
