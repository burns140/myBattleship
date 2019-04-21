var http = require('http');

http.createServer(function (req, res) {
	//res.end('Hello World');
	var min = 1;
	var max = 1000000;
	var random = Math.floor(Math.random() * (+max - +min) + +min);
	res.writeHead(200, {'Content-Type': 'text/html'});
	//res.write('<canvas id=\"myCanvas\" width=\"10000\" height=\"10000\"></canvas>');
	res.end('Random Number Generated: ' + random.toString());
}).listen(3000);