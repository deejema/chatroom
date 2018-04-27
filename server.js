const express = require('express'),
      path = require('path'),
      bodyParser = require('body-parser'),
      cors = require('cors'),
      mongoose = require('mongoose'),
// API file for interacting with MongoDB
      api = require('./server/routes/api');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/chat').then(
    () => {console.log('Database is connected') },
    err => { console.log('Can not connect to the database'+ err)}
  );

const app = express();

// Parsers
app.use(bodyParser.json());
app.use(cors());

// Define the port number
const port = process.env.PORT || 3000;

// API location
app.use(express.static(path.join(__dirname, 'dist'))); // Opens up app
app.use('/api', api);

const server = app.listen(port, function(){
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