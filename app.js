require('dotenv').config();
const express = require('express');
const LeagueJS = require('LeagueJS');

const app = express();
const port = process.env.PORT;
const leagueJs = new LeagueJS(process.env.API_TOKEN);

app.get('/', function(req, res) {
	res.status(200);
	res.send();
});

app.get('/test', function(req, res) {
	res.status(200);
	res.json({message: 'Connection test was a success!'});
});

app.get('/summoner', function(req, res) {
	var summonerName;

	leagueJs.Summoner.gettingByName('Doublelift')
	.then(summoner => {
		summonerName = summoner.name;
		res.status(200);
		res.json({summonerName: summonerName})
	})
});

app.listen(port);
