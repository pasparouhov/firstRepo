var express = require('express')
var app = express()
var path = require('path');
var Firebase = require("firebase");
var myFirebaseRef = new Firebase("https://incandescent-torch-384.firebaseio.com/");
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
var globalMessages=[];
myFirebaseRef.child("messages").on("value", callBack = function(snapshot) {
 globalMessages=snapshot.val()
});

app.get('/', function (req, res) {
   res.render('index', { title: "Chat group", messages: globalMessages });
})

app.post('/message', function (req, res) {
  var message = req.body.message;
  var username = req.body.username;

  console.log("here")
  console.log(globalMessages)
  myFirebaseRef.child("messages").push({
    username: username,
    message: message
  });
  
  myFirebaseRef.set({ messages: globalMessages}, function(error) {
    res.redirect('/');
  });
})
app.post('/clear', function (req, res) {
    myFirebaseRef.child("messages").remove()
    res.redirect('/');
  })
var server = app.listen(3000, function () {

  var host = server.address().address
  var port = server.address().port

  console.log('Example app listening at http://%s:%s', host, port)

})