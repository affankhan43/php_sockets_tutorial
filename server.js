var socket = require('socket.io'),
express = require('express'),
https = require('https'),
http = require('http');
const { createLogger, format, transports } = require('winston')

const logger = createLogger({
  level: 'info',
  transports: new transports.Console({
    format: format.combine(
      format.timestamp({
        format: 'YYYY-MM-DD' // Optional for choosing your own timestamp format.
      }),
      format.json()
    )
  })
})
//logger.add(logger.transports.Console, { colorize: true, timestamp: true});
logger.info('SocketIO > listening on port');

var app = express();
var cors = require('cors');
var http_server = http.createServer(app.use(cors({origin:'*'}))).listen(3001,'0.0.0.0');
    function emitNewOrder(http_server){
      var io = socket.listen(http_server);
      var request = require("request");

      io.sockets.on('connection',function(socket){
        socket.on("deposits", function(data){
          if(typeof(data) == 'object'){
            var options = { method: 'POST',
              url: 'https://sys.pixiubit.com/api/token_verify',
              headers:
              {
                'Cache-Control': 'no-cache',
                'Content-Type': 'application/js',
                'Accept': 'application/json'
              },
              body:
              {
                'token': data.token
              },
              json: true
            };
            request(options, function (error, response, body) {
              if (error) throw new Error(error);
              console.log(data.token); 
              console.log(response); 
            });
            
          }
          else{
            console.log(typeof(data));
            }
          })
      });
    }
emitNewOrder(http_server);


