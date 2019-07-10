var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

users = [];
connections = [];

var name;
app.get('/', function(req, res){
	res.sendFile(__dirname + '/main.html');
});

io.sockets.on('connection', function(socket){
	connections.push(socket);
	console.log("Connected: %s sockets connected", connections.length);

	/* When a user disconnects from the chat */
	socket.on('disconnect', function(data){

		io.sockets.emit('delete user', {per: socket.username});
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
	    // console.log(data +" : has joined the chat ");

		socket.username = data;
		users.push(data);
		updateUsernames();

		// name = data;
		// console.log('a');
		io.sockets.emit('new person', {name: data});
	});

	function updateUsernames(){
		io.sockets.emit('get_users', users);
	}

	// function joinUser(u){
	// }
});

server.listen(3000);
console.log('Server Running on localhost:3000'); 