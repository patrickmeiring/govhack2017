
/**
 * In terms of state, client should deal with state. 
 * The server is state-less, client will process the message and deal with it.
 * client will initiate save and different requests depending on its own state.
 */
let socket = io();

// connection initiation callback
socket.on('connect', function(data) {
});

// mesage from Serial port
socket.on('data_1', function(data) {
	console.log("Data: " + data);
});

