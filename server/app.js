// lib
var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var passport = require('passport');
var localStrategy = require('passport-local').Strategy;
var flash  = require('connect-flash');
var session = require('express-session');
var vhost = require('vhost');
var _ = require('underscore');
var util = require('util');

// http + websocket
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

// routes
var routes = require('./routes/index');
var auth = require('./routes/auth');
var demo = require('./routes/demo');

// mongoose
mongoose.connect('mongodb://localhost/passport_local_mongoose');

// models
var Account = require('./models/account');
var FawPlayer = require('./models/faw-player');
var FawWord = require('./models/faw-word');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon());
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.locals.pretty = true;


// passport config
passport.use(new localStrategy(Account.authenticate()));
passport.serializeUser(Account.serializeUser());
passport.deserializeUser(Account.deserializeUser());

// store session to mongodb
var connectMongoStore = require('connect-mongo')(session);
app.use(session({
    secret: 'abc', // cookie secret key
    cookie: { maxAge: 24*60*60*1000 }, // 1000 = 1 seconds
    store: new connectMongoStore({
	db : 'session_store', // mongodb collection name
    })
}));

//app.use(session({ secret: 'abc' })); // store session in memory (memory leak with too many session)
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

app.use(function(req,res,next){
	    if (req.url != '/demo/find-a-word' && req.method != 'POST' && req.session.httpID ==  req.sessionID) {
		FawPlayer.disableInGame(req.session.passport.user, function (err, result){
		    if (err) { throw err; }
		});
	    }

    // variable user dans les templates jade
    res.locals.user = req.session.passport.user;
    console.log("sessionID : " + req.sessionID);
    next();
});

// routes
app.use('/', routes);
app.use('/auth', auth);
app.use('/demo', demo);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace


if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}


// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

/*********************************
 *                               *
 *                               *
 *      -=  WebSocket  =-        *
 *                               *
 *                               *
 *                               *
 *********************************/

var passportSocketIo = require("passport.socketio"); // https://github.com/jfromaniello/passport.socketio
io.use(passportSocketIo.authorize({
    cookieParser: cookieParser,
    key:         'connect.sid',       // the name of the cookie where express/connect stores its session_id
    secret:      'abcd',    // the session_secret to parse the cookie
    //store:       session,        // we NEED to use a sessionstore. no memorystore please
    store: new connectMongoStore({
	db: 'session_store',
	collection: 'sessions'
    }),
    success:     onAuthorizeSuccess,  // *optional* callback on success - read more below
    fail:        onAuthorizeFail,     // *optional* callback on fail/error - read more below
}));

function onAuthorizeSuccess(data, accept) {
    console.log('successful connection to socket.io');
    accept();
}

function onAuthorizeFail(data, message, error, accept) {
    console.log('failed connection to socket.io:', message);
    if (error) throw new Error(message);
    return accept(new Error(message));
}

//
// faw namespace and middleware
//

var faw_namespace = io.of('/faw-namespace');
var fawEngine = require('./classes/faw-engine');
var game = new fawEngine();

game.generateNewTable();
//game.displayTableConsole();

faw_namespace.use(function(socket, next) {
    if (socket.request.user.logged_in) {
	game.addPlayer(socket.request.user.username, socket.id);
	console.log(game.players);
    }
   next();
});

faw_namespace.on('connection', function(socket) {

    // ajoute une lettre et eventuellement valide le mot
    socket.on('addLetter', function (data) {
	// genere une nouvelle lettre
	var letter = game.setRandomLetterIntoTable(data.x, data.y);
	//game.displayTableConsole();
	// et l'envoie vers updateLetter
	faw_namespace.emit('updateLetter', { letter: letter, 
					     meshesPos: data.meshesPos,
					     i: data.x,
					     j: data.y
					   });

	game.getPlayerWord(socket.id, function(word) {
	    if (word.length < 25) {
		console.log('Avant ' + word + ' Length ' + word.length);
		game.addLetterToWord(data.letter, socket.id);
		game.getPlayerWord(socket.id, function(word) {
		    console.log('Après ' + word + ' Length ' + word.length);
		    if (word.length == 25) {
			game.defineScore(word, socket.id, function(score) {
			    console.log('Score ' + score);
			    socket.emit('clearInput', { clear : true, score : score });
			    game.getPlayerStats(socket.id, function(stats) {
				socket.emit('stats', { stats: stats });
				game.clearPlayerWord(socket.id);
			    });
			});
		    }
		});
	    }
	});

    });

    // submit, valide le mot, retourne le nombre de points 
    socket.on('submit', function (data) {
	game.getPlayerWord(socket.id, function(word) {
	    game.defineScore(word, socket.id, function(score) {
		socket.emit('score', { score : score });
		game.clearPlayerWord(socket.id);

		game.getPlayerStats(socket.id, function(stats) {
		    socket.emit('stats', { stats: stats });
		});
	    });
	});
    });

    if (game.nbPlayers >= 2) {
	faw_namespace.emit('title', { message: 2 });
	faw_namespace.emit('playersList', { playersList: game.getPlayerList() });
	// envoie le tableau contenant les lettres
	faw_namespace.emit('start', { table : game.table });
    }
    else if (game.nbPlayers == 1) {
	socket.emit('title', { message: 1 });
	faw_namespace.emit('playersList', { playersList: game.getPlayerList() });
    }

    socket.on('disconnect', function () {
	game.removePlayer(socket.id);
	console.log(game.players); 
	if (game.nbPlayers >= 2) {
	    faw_namespace.emit('title', { message: 2 });
	    faw_namespace.emit('playersList', { playersList: game.getPlayerList() });
	}
	else if (game.nbPlayers == 1){
	    socket.broadcast.emit('title', { message: 1 });
	    faw_namespace.emit('playersList', { playersList: game.getPlayerList() });
	    console.log(util.inspect(game.players[0]));
	}
    });
/*
	FawPlayer.getWebSocketSession(socket.request.user.username, function (err, result){
	    if (err) { throw err; }
	    // envoyer un message vers le socket id connecté
	    socket.emit('news', { hello: result.wsId + ' from ' + result.playername });
	    // envoyer un message vers un socket id specifique
	    io.to(result.wsId).emit('news', { hello: result.wsId + ' from ' + result.playername });
	    // envoyer un message aux autres socket id connectés sauf celui qui est connecté
	    socket.broadcast.emit('news', { hello: 'tg biatch' });
	    // envoyer un message a tous les socket id connectés
	    io.sockets.emit('news', { hello: 'tg bande de biatch' });
	    // envoyer un message a tous les socket id connectés en utilisant le namespace 'tintin'
	    tintin.emit('news', { hello: 'coucoy' });
	});
*/
});

// default namespace and middleware
io.use(function(socket, next) {

    next();
});


io.on('connection', function (socket) {

});

// http & websocket sur le port 3000
app.set('port', process.env.PORT || 3000);
server.listen(app.get('port'), function(){
    console.log('Express http/socket server listening on port ' + app.get('port'));
});