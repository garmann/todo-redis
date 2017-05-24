var bunyan = require('bunyan');
var logger = bunyan.createLogger(
  {
    name: 'todo-redis',
    streams: [{
            type: 'rotating-file',
            path: 'log/info.log',
            period: '1d',   // daily rotation
            count: 3        // keep 3 back copies
        },
        {
            type: 'rotating-file',
            path: 'log/debug.log',
            period: '1d',   // daily rotation
            count: 3,       // keep 3 back copies
            level: 'debug'
        }

        ]
      

  });

module.exports = logger;