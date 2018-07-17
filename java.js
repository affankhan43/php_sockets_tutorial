const app = require('express')();
const cors = require('cors');

app.use(cors());

const server = require('http').createServer(app).listen(3000);
const io = require('socket.io').listen(server);
io.set('transports',['websockets']);
io.on('connection',function(socket){
	console.log(socket);
});