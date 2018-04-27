var express = require('express');
var router = express.Router();

// Require Item model in our routes module
var ChatLine = require('../../models/ChatLine');

// Add to chat log 
router.route('/add').post(function (req, res) {
  var chatLine = new ChatLine(req.body);
   chatLine.save()
    .then(item => {
    res.status(200).json({'ChatLine': 'Chat added successfully'});
    })
    .catch(err => {
    res.status(400).send("unable to save to database");
    });
});

// Defined get data(index or listing) route
router.route('/getchat').get(function (req, res) {
   ChatLine.find(function (err, chatline){
    if(err){
      console.log(err);
    }
    else {
      res.json(chatline);
    }
  });
});


module.exports = router;



/*
const express = require('express');
const router = express.Router();
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;

// Connect
const connection = (closure) => {
    return MongoClient.connect('mongodb://localhost:27017/chat', (err, client) => {
        if (err) return console.log(err);
		let db = client.db('chat');
        closure(db);
    });
};

// Error handling
const sendError = (err, res) => {
    response.status = 501;
    response.message = typeof err == 'object' ? err.message : err;
    res.status(501).json(response);
};

// Response handling
let response = {
    status: 200,
    data: [],
    message: null
};

// Get chat
router.get('/getchat', (req, res) => {
    connection((db) => {
        db.collection('chat')
            .find()
            .toArray()
            .then((users) => {
                response.data = users;
                res.json(response);
            })
            .catch((err) => {
                sendError(err, res);
            });
    });
});

module.exports = router;
*/