var socket = require('socket.io'),
express = require('express'),
https = require('https'),
http = require('http');
fs = require('fs');
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
   var  options = {
    key: fs.readFileSync('/etc/letsencrypt/live/ws.pixiubit.com/privkey.pem'),
    cert: fs.readFileSync('/etc/letsencrypt/live/ws.pixiubit.com/fullchain.pem'),
    requestCert: true
  }
  var http_server = https.createServer(options,app).listen(3001);

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
                'Postman-Token': 'd436fc1f-e3e5-4cf2-bbe2-57917fbc4940',
                'Cache-Control': 'no-cache',
                'Content-Type': 'application/json',
                'Accept': 'application/json'
              },
              body:
              {
                token: data.token
              },
              json: true
            };

            request(options, function (error, response, body) {
              if (error) throw new Error(error);
              if(body.success == true){
                io.emit(data.name,{"data":data.data});
              }
            });
          }
          else{
            console.log('Deposits Data Error');
            }
          })
      });
    }
emitNewOrder(http_server);


