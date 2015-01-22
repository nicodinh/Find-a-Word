//
// classe du moteur de jeu faw
//

var _ = require('underscore');
var async = require("async");
var util = require('util');
var modelPlayer = require('../models/faw-player');
var modelWord = require('../models/faw-word');

function FawEngine(room) {
    this.room = room || "1"; // room de la partie en cours
    this.players = []; 
    this.table = this.generateNewTable();
    this.nbPlayers = 0;
}

// methods
FawEngine.prototype = {

    // creer un tableau a n dimensions
    createArray: function(length) {
	var arr = new Array(length || 0);
	var i = length;
	if (arguments.length > 1) {
            var args = Array.prototype.slice.call(arguments, 1);
            while(i--) arr[length-1 - i] = this.createArray.apply(this, args);
	}
	return arr;
    },

    // genere un tableau de 5 lignes et 10 colonnes remplis de lettre aleatoirement
    generateNewTable: function () {
	var letters = "esiarntoluécmpdgbfhzvâqyèxj-îçêkûïôwàüëùesiarntoluécmpdgbfhqèjesiarntoluécmpdgbfèesiarntolucmpdgbfesiarntolucmpdgbfesiarntolucmpdgbf";
	var table = this.createArray(5, 10);
	var x = 0;
	var y = 0;
	while (x < 5) {
	    while (y < 10){
		table[x][y] = letters.charAt(Math.floor(Math.random() * letters.length));
		y++;
	    }
	    y = 0;
	    x++;
	}
	return table;
    },

    // genere une lettre aleatoirement
    generateNewLetter: function () {
	var letters = "esiarntoluécmpdgbfhzvâqyèxj-îçêkûïôwàüëùesiarntoluécmpdgbfhqèjesiarntoluécmpdgbfèesiarntolucmpdgbfesiarntolucmpdgbfesiarntolucmpdgbf";
	letter = letters.charAt(Math.floor(Math.random() * letters.length));
	return letter;
    },

    // affiche le tableau de lettres dans la console
    displayTableConsole: function () {
	var x = 0;
	var y = 0;
	var raw = [];
	while (x < 5) {
	    while (y < 10){
		raw += this.table[x][y];
		y++;
	    }
	    y = 0;
	    console.log(raw);
	    raw = [];
	    x++;
	}
    },

    // modifie aleatoirement une lettre du tableau a la position donnée
    setRandomLetterIntoTable: function (posX, posY) {
	var letter = this.generateNewLetter();
	if (!_.isUndefined(letter))  
	    this.table[posX][posY] = letter;
	else
	    this.table[posX][posY] = 'e';
	return letter;
    },

    // ajoute un nouveau joueur (player type object) et le rajoute dans joueurs (players type array)
    addPlayer: function(username, websocketId) {
	var player = {};
	var stats = {};
	player.name = username;
	player.wsId = websocketId;
	player.word = '';
	stats.score = 0; // score total
	stats.fullList = [];
	stats.scoresList = [];
	stats.successWordsList = [];
	stats.errorWordsList = [];
	stats.errors = 0;
	stats.success = 0;
	stats.currentHighestWordStreak = 0;
	stats.highestWordStreak = 0;
	player.stats = stats;
	this.players.push(player);
	this.nbPlayers = this.players.length;
	modelPlayer.updateWebSocketSession(username, websocketId, function (err){
            if (err) { throw err; }
	});
    },

    // enleve un joueur specifique du tableau des joueurs et mets ses données a jour en bdd
    removePlayer: function(websocketId) {
	var index = -1;
	for (var i = 0; i < this.nbPlayers; i++) {
	    if (this.players[i].wsId == websocketId) {
		index = i;
		break;
	    }
	}
	if (index > -1) {
	    // on met a jour le score en bdd si le score est different de 0
	    if (this.players[index].stats.score != 0) {
		modelPlayer.updateTotalPoints(websocketId, this.players[index].stats.score, function(err){
		    if (err) { throw err; }
		    console.log('save total points');
		});
	    }
	    // update dans la bdd la partie 'this.players[index].stats'
	    modelPlayer.updateStats(websocketId, this.players[index].stats, function(err) {
		if (err) { throw err; }
		console.log('save stats');
	    });
	    // on efface le wsID de la bdd
	    modelPlayer.clearWebSocketSession(this.players[index].name, function (err){
		if (err) { throw err; }
		console.log('clear wsID');
	    });
	    // on retire le joueur de la liste des joueurs
	    this.players.splice(index, 1);
	}
	// on met a jour le nombre de joueurs connectés
	this.nbPlayers = this.players.length;
    },

    // recupere la liste de tout les joueurs connectés et envoie l'info a tout les clients                   
    getPlayerList: function() {
        result = '';
        var max = this.players.length - 1;
        for (var i in this.players){
            result += this.players[i].name;
            if (i < max)
                result += ', ';
        }
	return result;
    },

    // update le score d'un joueur donné (players[i].stats.score) 
    updatePlayerScore: function(score, websocketId) {
	for (var i = 0; i < this.nbPlayers; i++) {
	    if (this.players[i].wsId == websocketId) {
		this.players[i].stats.score += score;
		break;
	    }
	}
    },

    // update le score d'un joueur donné (players[i].stats.score) 
    updatePlayerStats: function(score, word, websocketId) {
	for (var i = 0; i < this.nbPlayers; i++) {
	    if (this.players[i].wsId == websocketId) {
		this.players[i].stats.score += score;
		this.players[i].stats.scoresList.push(score);
		this.players[i].stats.fullList.push(word);
		this.players[i].stats.fullList.push(score);
		if (score > 0) {
		    this.players[i].stats.success++;
		    this.players[i].stats.successWordsList.push(word);
		    this.players[i].stats.currentHighestWordStreak++;
		    if (this.players[i].stats.currentHighestWordStreak > this.players[i].stats.highestWordStreak) {
			this.players[i].stats.highestWordStreak = this.players[i].stats.currentHighestWordStreak;
		    }
		    //console.log(util.inspect(this.players[i].stats));
		}
		else {
		    this.players[i].stats.errors++;
		    this.players[i].stats.errorWordsList.push(word);
		    if (this.players[i].stats.currentHighestWordStreak > 0) {
			this.players[i].stats.currentHighestWordStreak = 0;
		    }
		    //console.log(util.inspect(this.players[i].stats));
		}
		break;
	    }
	}
    },

    // recupere le score total d'un joueur
    getPlayerScore: function(websocketId) {
	for (var i = 0; i < this.nbPlayers; i++) {
	    if (this.players[i].wsId == websocketId) {
		return this.players[i].stats.score;
	    }
	}
    },

    // recupere le score total d'un joueur
    getPlayerStats: function(websocketId, cb) {
	for (var i = 0; i < this.nbPlayers; i++) {
	    if (this.players[i].wsId == websocketId) {
		cb(this.players[i].stats);
	    }
	}
    },

    // fonction appelé par defineScore teste si le mot existe en base de donnée ou non
    isWordExist: function(word, cb) {
	modelWord.isWordExist(word, function (err, result){
	    if (err) { throw err; }
	    if (!_.isNull(result)) { cb(true); } else { cb(false); } 
	});
    },

    // fonction appelé pour definir le score en fonction de l existence ou non du mots
    // return le score : si positif le mot existe si négatif le mot n'existe pa
    defineScore: function(word, websocketId, cb) {
	var scores = {'a': 1, 'b': 3, 'c': 1, 'd': 2, 'e': 1, 'f': 3, 'g': 2, 'h': 3, 'i': 1, 'j': 5,
		      'k': 6, 'l': 1, 'm': 2, 'n': 1, 'o': 1, 'p': 2, 'q': 4, 'r': 1, 's': 1, 't': 1,
		      'u': 1, 'v': 3, 'w': 7, 'x': 5, 'y': 4, 'z': 3, '-': 6, 'à': 8 ,'â': 4, 'ç': 6,
		      'é': 1, 'è': 4, 'ê': 6, 'ë': 8, 'î': 6, 'ï': 7, 'ô': 7, 'ù': 9, 'û': 6 ,'ü': 8};
	var score = 0;
	var wordSize = word.length;
	for (var i = 0; i < wordSize; i++) {
	    score += scores[word[i]];
	}
	var myThis = this;
	this.isWordExist(word, function(result) {
	    if (result) { 
		myThis.updatePlayerStats(score, word, websocketId);
		cb(score);
	    } 
	    else {
		score *= -1;
		myThis.updatePlayerStats(score, word, websocketId);
		cb(score);
	    }
	});
    },

    // recupere le mot d'un joueur
    getPlayerWord: function(websocketId, cb) {
	for (var i = 0; i < this.nbPlayers; i++) {
	    if (this.players[i].wsId == websocketId) {
		cb(this.players[i].word);
	    }
	}
    },

    // ajoute une lettre au mot d'un joueur
    addLetterToWord: function(letter, websocketId) {
	for (var i = 0; i < this.nbPlayers; i++) {
	    if (this.players[i].wsId == websocketId) {
		this.players[i].word += letter;
	    }
	}
    },

    // efface le mot d'un joueur
    clearPlayerWord: function(websocketId) {
	for (var i = 0; i < this.nbPlayers; i++) {
	    if (this.players[i].wsId == websocketId) {
		this.players[i].word = '';
	    }
	}
    }

};

module.exports = FawEngine;