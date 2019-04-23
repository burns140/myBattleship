var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var playernum = 0;


app.get('/', function(req, res) {
	playernum++;
	if (playernum > 2) {
		res.end('<h1>fuck you</h1>');
		return;
	}
	res.sendFile(__dirname + '/testgrid.html');
});

io.on('connection', function(socket) {
	io.emit('setusernum', playernum);
	console.log(playernum);
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