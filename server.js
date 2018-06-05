const express = require('express');
const app = express();
const router = express.Router();
const path = require('path');
const bodyParser = require('body-parser');
// Cross-Origin resource sharing
const cors = require('cors');
// Mongoose api
const mongoose = require('mongoose');

// Parse server
const ParseServer = require('parse-server').ParseServer;

/*
// API file for interacting with MongoDB
const api = require('./server/routes/api');
*/

//111111-------------------------------------------------
// Set up parse server
var databaseUri = process.env.DATABASE_URI || process.env.MONGODB_URI;

var api = new ParseServer({
  databaseURI: databaseUri || 'mongodb://heroku_50185dzv:mfdmdshaa6cujscrmlh52np8il@ds119930.mlab.com:19930/heroku_50185dzv',
  cloud: process.env.CLOUD_CODE_MAIN || __dirname + '/cloud/main.js',
  appId: process.env.APP_ID || '12345',
  masterKey: process.env.MASTER_KEY || 'masterkey', //Add your master key here. Keep it secret!
  serverURL: process.env.SERVER_URL || 'https://desolate-bayou-57447.herokuapp.com/parse/',  // Don't forget to change to https if needed
  javascriptKey: 'abs',
  liveQuery: {
    classNames: ["chat"] // List of classes to support for query subscriptions
  }
});

//curl -X GET -H "X-Parse-Application-Id: 12345" -H "X-Parse-Master-Key: masterkey" https://desolate-bayou-57447.herokuapp.com/parse/classes/chat
var Parse = require('parse/node');
Parse.initialize('12345', 'abs', 'masterkey');
Parse.serverURL = 'https://desolate-bayou-57447.herokuapp.com/parse';

//----------------------------------------------------
const http = require('http');
const server = http.createServer(app);
// Used for bidirectional communication using Socket api
//const socketIO = require('socket.io');
//const io = socketIO(server);

// Allows io to determine when a user has connected to the server.  client sends to data
/*io.on('connection',(socket) => {
	console.log('user connected');
	
	socket.on('new-message',(message) => {
		console.log(message);
		/*	broadcasts to all users except the sender	*/
/*		socket.broadcast.emit('updateChat', message);
	});
	socket.on('disconnect', function() {
		console.log(socket.id);
	});

});	*/

var ChatLine = require('./models/ChatLine');

//22222222--------------------------------------------------------

// Connects to mongo db
/*mongoose.Promise = global.Promise;
mongoose.connect('mongodb://heroku_50185dzv:mfdmdshaa6cujscrmlh52np8il@ds119930.mlab.com:19930/heroku_50185dzv').then(
    () => {console.log('Database is connected') },
    err => { console.log('Can not connect to the database'+ err)}
  );
*/
//--------------------------------------------------------

// Parsers
app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());
app.use(cors());
app.use(router);

// Define the port number
//33333333---------------------------------------------------------
const port = process.env.PORT || 1337;
//const port = process.env.PORT || 3000;
//----------------------------------------------------------

// API location
app.use(express.static(path.join(__dirname, 'dist'))); // Opens up app


/*
// Used to set mongo db routes to server/routes/api.js
app.use('/api', api);
*/

//4444444------------------------------------------------
// Serve the Parse API on the /parse URL prefix (parse is default
var mountPath = process.env.PARSE_Mount || '/parse';
app.use(mountPath, api);

//---------------------------------------------------------

// Get request to receive all messages from server
var chat = Parse.Object.extend("chat");

//router.route('/getchat').get(function(req, res) {
	
	
router.get('/chat', function(req, res) {
	var Chat = new Parse.Query(chat);
	
	Chat.find( {
		success: function(res) {
			res.data = res;
			res.json(res);
		}
	});
	/*Parse.Cloud.run('getLog')
	.then(function(chatline) {
		res.json(chatline);
	});
	*/
	console.log("lalalalasla");
	/*ChatLine.find(function(err, chatline) {
		if(err) {
			console.log(err);
		}
		else {
			res.json(chatline);
		}
	});
	*/
});

// Send a post request to add messages to server
//router.route('/add').post(function(req, res) {
router.post('/chat', function(req, res) {
	/*var chatLine = new ChatLine(req.body);
   chatLine.save()
    .then(item => {
    res.status(200).json({'ChatLine': 'Chat added successfully'});
    })
    .catch(err => {
    res.status(400).send("unable to save to database");
    });*/
	
	console.log("vczxn,vcxznmv,czx,");
});


app.listen(port, () => {
	console.log('Listening on port ' + port);
});
// ------------------------------------------------------------
// Enables the Live Query real-time server
//ParseServer.createLiveQueryServer(server);
	



// example - adds to chat db
//var Chat = Parse.Object.extend("chat");
// Adds to mongo db
//let chat = new Chat();
/*chat.set("username", "TestFromParse");
chat.set("content","I am from parse test");
chat.save();
*/


// Expected: Get the number of chat messages from server
// Get an error: Code 1: bad key in untransform
var query = new Parse.Query("chat");
query.find( {
		success: function(res) {
			res.data = res;
			console.log(res[0].get("username"));
		},
		error: function(err) {
			console.log("error");
		}
});


/*let subscription = query.subscribe();
subscription.on('open', () => {
 console.log('subscription opened');
});
*/