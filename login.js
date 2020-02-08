// Example Project: https://codeshack.io/basic-login-system-nodejs-express-mysql/

//we need the following packages for our log-in
var mysql = require('mysql');
var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var path = require('path');

//create database through terminal:
// sudo mysql -p and enter password

//connect database
var connection = mysql.createConnection({
	host     : 'localhost',
	user     : 'root',
	password : 'Tak70731',
	database : 'nodelogin'
});
connection.connect((err) => {
    if (err) throw err;
    console.log('Connected!');
  });
  
//Express is what we'll use for our web applications, this includes packages useful in web development, 
//such as sessions and handling HTTP requests, to initialize it we can do:
var app = express()

app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));
//the bodyParser package will extract the form data from our login.html file.
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

//We now need to display our login.html file to the client
app.get('/', function(request, response) {
	response.sendFile(path.join(__dirname + '/login.html'));
});

//We need to now handle the POST request, basically what happens here is when the client 
//enters their details in the login form and clicks the submit button, 
//the form data will be sent to the server, and with that data our login 
//script will check in our MySQL accounts table to see if the details are correct.
app.post('/auth', function(request, response) {
	var username = request.body.username;
    var password = request.body.password;
    console.log(username, password)
	if (username && password) {
		connection.query('SELECT * FROM accounts WHERE username = ? AND password = ?', [username, password], function(error, results, fields) {
            console.log(results.length)
			if (results.length > 0) {
				request.session.loggedin = true;
				request.session.username = username;
				response.redirect('/home');
			} else {
				response.send('Incorrect Username and/or Password!');
			}			
			response.end();
		});
	} else {
		response.send('Please enter Username and Password!');
		response.end();
	}
});

//If everything went as expected and the client logs in they will be redirected to the home page.
//The home page we can handle with another GET request:

app.get('/home', function(request, response) {
	if (request.session.loggedin) {
		response.send('Welcome back, ' + request.session.username + '!');
	} else {
		response.send('Please login to view this page!');
	}
	response.end();
});

//Listen in port 3000
app.listen(3000);
