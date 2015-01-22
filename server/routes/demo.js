var express = require('express');
var router = express.Router();
var Faw = require('../models/faw-player');
var _ = require('underscore');

router.get('/', function(req, res) {
    res.redirect('/');
});

router.get('/find-a-word', fawGetPlayerList, function(req, res) {
    Faw.isInGame(req.session.passport.user, function (err, resultInGame){
	if (err) return console.error(err);
	if (!_.isNull(resultInGame)){
	    if (resultInGame.httpID == req.sessionID){
		req.session.httpID = req.sessionID;
		req.inGame = true;
		res.render('find-a-word', { user : req.user, 
					    players : req.players, 
					    inGame : req.inGame 
					  });
	    }
	    else {
		req.session.httpID = '';
		res.render('find-a-word-error', { players : req.players, 
						  errorPlayer : true 
						});
	    }
	}
	else {
	    if (_.isEmpty(req.session.passport))
		req.session.httpID = '';
	    else
		req.session.httpID = req.sessionID;
	    res.render('find-a-word', { user : req.user,
					players : req.players,
					inGame : req.inGame 
				      });
	}
    });
});

// rejoindre la partie
router.post('/find-a-word', fawManagePlayer, fawGetPlayerList, function(req, res) {
    Faw.getWebSocketSession(req.session.passport.user, function (err, result){
	if (err) { throw err; }
	if (_.isEmpty(result.wsId)) {	
	    res.render('find-a-word', { //players : req.players, 
					inGame : req.inGame
				      });
	}
	else {
	    req.session.httpID = '';
	    res.render('find-a-word-error', { players : req.players, 
					      errorPlayer : true 
					    });
	}
    });
});

// quitter la partie
router.post('/find-a-word/leave', fawLeave, function(req, res) {
    res.redirect('/demo/find-a-word');
});

// middleware : faw = find a word
function fawGetPlayerList(req, res, next) {
    // recupere la liste de tout les joueurs connectés
    Faw.getAllPlayers(function (err, players){
	if (err) { throw err; }
	req.players = '';
	var max = players.length - 1;
	for (var i in players){
	    req.players += players[i].playername;
	    if (i < max)
		req.players += ', ';
	}
	return next();
    });
}

function fawManagePlayer(req, res, next) {    
    Faw.findPlayer(req.session.passport.user, function (err, players){
	if (err) { throw err; }
	if (_.isNull(players)){
	    var player = new Faw({
		playername: req.session.passport.user, 
		wsId: "",
		httpID: req.sessionID,
		totalPoints: 0, 
		inGame: true,
		room: "1"
	    });
	    player.save(function (err) {
		if (err) { throw err; }
		console.log('Joueur ajouté avec succès !');
		req.inGame = true;
		return next();
	    });
	}
	else {
	    Faw.getWebSocketSession(req.session.passport.user, function (err, result){
		if (err) { throw err; }
		if (_.isEmpty(result.wsId)) {	
		    Faw.enableInGame(req.session.passport.user, function (err, result){
			if (err) { throw err; }
			Faw.updateHTTPSession(req.session.passport.user, req.sessionID, function (err, result){
			    if (err) { throw err; }
			    req.inGame = true;
			    return next();
			});
		    });
		}
		else {
		    return next();
		}
	    });
/*
	    Faw.enableInGame(req.session.passport.user, function (err, result){
		if (err) { throw err; }
		Faw.updateHTTPSession(req.session.passport.user, req.sessionID, function (err, result){
		    if (err) { throw err; }
		    req.inGame = true;
		    return next();
		});
	    });
*/
	}
    });
}

function fawLeave(req, res, next) {
    Faw.disableInGame(req.session.passport.user, function (err, result){
	if (err) { throw err; }
    });
    return next();
}


module.exports = router;
