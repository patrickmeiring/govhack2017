let express = require('express');  
let app = express();  
let server = require('http').createServer(app);  
let io = require('socket.io').listen(server);
let path = require('path');

app.use(express.static(__dirname + '/static/template'));
app.use(express.static(__dirname + '/static/script'));
app.use(express.static(__dirname + '/static/img'));

app.get('/', function(req, res) {
	res.sendFile('index.html');
});

data = [1,2,3,4,5];

/**
 * Processing output sent from Software.
 */
io.on('connection', function(socket) {
	console.log('client connected');

	socket.on('data_1', function() {
		socket.emit('data_1', data);
	});
});

server.listen(3000, function(socket) {
	console.log('listening on port 3000');
	console.log('launched chrome');
	const childProc = require('child_process');
	childProc.exec('start chrome http://localhost:3000');
});
