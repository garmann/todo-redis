exports.index = function(request, response){
  response.status(200).json({status: 'ok', content: 'have fun!'});
};
