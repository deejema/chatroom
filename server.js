const express = require('express');
const app = express();

const path = require('path');
const bodyParser = require('body-parser');
// Cross-Origin resource sharing
const cors = require('cors');
// Mongoose api
const mongoose = require('mongoose');
// API file for interacting with MongoDB
const api = require('./server/routes/api');



const http = require('http');
const server = http.Server(app);
// Used for bidirectional communication using Socket api
const socketIO = require('socket.io');
const io = socketIO(server);



// Connects to mongo db
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/chat').then(
    () => {console.log('Database is connected') },
    err => { console.log('Can not connect to the database'+ err)}
  );


// Parsers
app.use(bodyParser.json());
app.use(cors());

// Define the port number
const port = process.env.PORT || 3000;

// API location
app.use(express.static(path.join(__dirname, 'dist'))); // Opens up app
app.use('/api', api);

/*const server = app.listen(port, function(){
	console.log('Listening on port ' + port);
});*/

// Allows io to determine when a user has connected to the server.  client sends to data
io.on('connection',(socket) => {
	console.log('user connected');
	
	socket.on('new-message',(message) => {
		console.log(message);
		/*	broadcasts to all users except the sender	*/
		socket.broadcast.emit('updateChat', message);
	});
	

});
server.listen(port, () => {
	console.log('Listening on port ' + port);
});
/*

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const http = require('http');

const app = express();
// API file for interacting with MongoDB
const api = require('./server/routes/api');

// Parsers
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));

// Angular DIST output folder
app.use(express.static(path.join(__dirname, 'dist')));

// API location
app.use('/api', api);


// Send all other requests to the Angular app
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist/index.html'));
});

//Set Port
const port = process.env.PORT || '3000';
app.set('port', port);

const server = http.createServer(app);

server.listen(port, () => console.log(`Running on localhost:${port}`));

*/