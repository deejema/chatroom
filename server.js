const express = require('express');
const app = express();

const path = require('path');
const bodyParser = require('body-parser');
// Cross-Origin resource sharing
const cors = require('cors');
// Mongoose api
const mongoose = require('mongoose');
// Parse server for 
var ParseServer = require('parse-server').ParseServer;
/*
// API file for interacting with MongoDB
const api = require('./server/routes/api');
*/
//-------------------------------------------------
/*var databaseUri = process.env.DATABASE_URI || process.env.MONGODB_URI;
var api = new ParseServer({
  databaseURI: databaseUri || 'mongodb://localhost:27017/chat',
  cloud: process.env.CLOUD_CODE_MAIN || __dirname + '/cloud/main.js',
  appId: process.env.APP_ID || 'myAppId',
  masterKey: process.env.MASTER_KEY || '', //Add your master key here. Keep it secret!
  serverURL: process.env.SERVER_URL || 'http://localhost:1337/parse',  // Don't forget to change to https if needed
  liveQuery: {
    classNames: ["Posts", "Comments"] // List of classes to support for query subscriptions
  }
});
*/
//----------------------------------------------------
const http = require('http');
const server = http.Server(app);
// Used for bidirectional communication using Socket api
const socketIO = require('socket.io');
const io = socketIO(server);

var ChatLine = require('./models/ChatLine');

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
//const port = process.env.PORT || 1337;
const port = process.env.PORT || 3000;

// API location
app.use(express.static(path.join(__dirname, 'dist'))); // Opens up app


/*
// Used to set mongo db routes to server/routes/api.js
app.use('/api', api);
*/

//var mountPath = process.env.PARSE_Mount || '/parse';
//app.use(mountPath, api);

// Get request to receive messages from server
app.get('/getchat', function(req, res) {
	ChatLine.find(function(err, chatline) {
		if(err) {
			console.log(err);
		}
		else {
			res.json(chatline);
		}
	});
});

// Send a post request to add messages to server
app.post('/add', function(req, res) {
	var chatLine = new ChatLine(req.body);
   chatLine.save()
    .then(item => {
    res.status(200).json({'ChatLine': 'Chat added successfully'});
    })
    .catch(err => {
    res.status(400).send("unable to save to database");
    });
});

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

//ParseServer.createLiveQueryServer(httpServer);