require('dotenv').config();
const express = require('express');

const app = express();
const port = process.env.PORT;

app.get('/', function(req, res) {
	res.status(200);
	res.send();
});

app.get('/test', function(req, res) {
	res.status(200);
	res.json({message: 'Connection test was a success!'});
});

app.listen(port);
