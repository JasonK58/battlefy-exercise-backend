require('dotenv').config();
const express = require('express');
const LeagueJS = require('leaguejs/lib/LeagueJS.js');

const app = express();
const port = process.env.PORT;
const origins = process.env.ORIGINS.split(';')
const leagueJs = new LeagueJS(process.env.API_TOKEN);

app.use(function (req, res, next) {
	var origin = req.get('origin');
	
	if (origins.includes(origin)) {
		res.setHeader('Access-Control-Allow-Origin', origin);
	}
	
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);

    next();
});

app.get('/', function(req, res) {
	res.status(200);
	res.send();
});

app.get('/test', function(req, res) {
	res.status(200);
	res.json({message: 'Connection test was a success!'});
});

app.get('/summoner', function(req, res) {
	var summonerName = req.query.name;
	
	var gameArray = [];
	var gameDuration;
	var participantId;

	leagueJs.Summoner.gettingByName(summonerName)
	.then(summoner => {
		return leagueJs.Match.gettingListByAccount(summoner.accountId, {beginIndex: 0, endIndex: 5});
	})
	.then(matchList => {
		matchList.matches.forEach(matchElement => {
			leagueJs.Match.gettingById(matchElement.gameId)
			.then(match => {
				gameDuration = match.gameDuration;
				
				match.participantIdentities.forEach(participantElement => {
					if (participantElement.player.summonerName === summonerName) {
						participantId = participantElement.participantId;
					};
				});
				match.participants.forEach(participantElement => {
					if (participantId === participantElement.participantId) {
						var gameElement = {
							win: participantElement.stats.win,
							spell1Id: participantElement.spell1Id,
							spell2Id: participantElement.spell2Id,
							perk1Id: participantElement.stats.perk1,
							perk2Id: participantElement.stats.perk2,
							perk3Id: participantElement.stats.perk3,
							perk4Id: participantElement.stats.perk4,
							perk5Id: participantElement.stats.perk5,
							championId: participantElement.championId,
							kills: participantElement.stats.kills,
							deaths: participantElement.stats.deaths,
							assists: participantElement.stats.assists,
							item0Id: participantElement.stats.item0,
							item1Id: participantElement.stats.item1,
							item2Id: participantElement.stats.item2,
							item3Id: participantElement.stats.item3,
							item4Id: participantElement.stats.item4,
							item5Id: participantElement.stats.item5,
							item6Id: participantElement.stats.item6,
							champLevel: participantElement.stats.champLevel,
							creepScore: participantElement.stats.totalMinionsKilled
						};
						
						gameArray.push(gameElement);
					};
				});
			})
			.then(() => {
				res.status(200);
				res.json({games: gameArray})
			})
		})
	})
});

app.listen(port);
