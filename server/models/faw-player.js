var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var myConnection = mongoose.createConnection('localhost', 'faw');
var fawSchema = new Schema({
    playername: String, // nom du joueur
    totalPoints: Number, // total du nombre de points
    inGame: Boolean, // si le joueur est dans la partie ou non
    wsId: String, // id de la session websocket
    httpID: String, // id de la session http
    room: String, // room de la partie
    stats: [] // stats un sus document par parties
});

fawSchema.statics.getAllPlayers = function (cb) {
    return this.find({inGame: true}, {playername: 1, _id: 0}, cb);
}

fawSchema.statics.findPlayer = function (name, cb) {
    // return le nom du joueur ou null
    return this.findOne({playername: name}, {playername: 1, 
					     inGame: 1,
					     httpID: 1,
					     _id: 1
					    }, 
			cb);
}

fawSchema.statics.disableInGame = function(name, cb) {
    return this.update({playername: name}, {$set: {inGame: false}}, cb);
}

fawSchema.statics.enableInGame = function(name, cb) {
    return this.update({playername: name}, {$set: {inGame: true}}, cb);
}

fawSchema.statics.isInGame = function(name, cb) {
    // return le nom du joueur ou null
    return this.findOne({playername: name, inGame: true}, cb);
}

fawSchema.statics.updateWebSocketSession = function(name, session, cb) {
    return this.update({playername: name}, {$set: {wsId: session}}, cb);
}

fawSchema.statics.getWebSocketSession = function(name, cb) {
    return this.findOne({playername: name}, {wsId: 1, playername: 1, _id: 0}, cb);
}

fawSchema.statics.clearWebSocketSession = function(name, cb) {
    return this.update({playername: name}, {$set: {wsId: ""}}, cb);
}

fawSchema.statics.updateHTTPSession = function(name, session, cb) {
    return this.update({playername: name}, {$set: {httpID: session}}, cb);
}

fawSchema.statics.updateTotalPoints = function(session, points, cb) {
    return this.update({wsId: session}, {$inc: {totalPoints: points}}, cb);
}

fawSchema.statics.updateStats = function(session, array, cb) {
    return this.update({wsId: session}, {$push: {stats: array}}, cb);
}

module.exports = myConnection.model('player', fawSchema);