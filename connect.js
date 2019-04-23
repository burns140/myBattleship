var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

/**http.createServer(function (req, res) {
	//res.end('Hello World');
	var min = 1;
	var max = 1000000;
	var random = Math.floor(Math.random() * (+max - +min) + +min);
	res.writeHead(200, {'Content-Type': 'text/html'});
	//res.write('<canvas id=\"myCanvas\" width=\"10000\" height=\"10000\"></canvas>');
	res.end('Random Number Generated: ' + random.toString());
}).listen(3000);**/

app.get('/', function(req, res) {
	res.sendFile(__dirname + '/testgrid.html');
});

io.on('connection', function(socket) {
	console.log('user connected');
	socket.on('disconnect', function() {
		console.log('user disconnected');
	});
	socket.on('clicked', function(msg) {
		console.log('somebody shot something');
		io.emit('clicked', msg);
	});
});

http.listen(3000, function() {
	console.log('listening on 3000');
});