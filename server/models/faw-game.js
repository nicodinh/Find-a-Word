var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var myConnection = mongoose.createConnection('localhost', 'faw');
var fawSchema = new Schema({
    room: String, // nom de la room
  
});

module.exports = myConnection.model('game', fawSchema);