var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

users = [];
connections = [];

app.get('/', function(req, res){
	res.sendFile(__dirname + '/main.html');
});

io.sockets.on('connection', function(socket){
	connections.push(socket);
	console.log("Connected: %s sockets connected", connections.length);

	/* When a user disconnects from the chat */
	socket.on('disconnect', function(data){

		users.splice(users.indexOf(socket.username), 1);
		updateUsernames();
		connections.splice(connections.indexOf(socket), 1);
		console.log("Disconnected: %s sockets connected", connections.length);		
	});

	/* Sending a message */
	socket.on('send message', function(data){
		console.log(data);
		console.log('username: ' + socket.username);
		io.sockets.emit('new message', {msg:data, user: socket.username});
	});

	/* New User */
	socket.on('new user', function(data, callback){
		callback(true);
		console.log(data);
		socket.username = data;
		users.push(data);
		updateUsernames();
	});

	function updateUsernames(){
		io.sockets.emit('get_users', users);
	}
});

server.listen(3000);
console.log('Server Running on localhost:3000'); 