var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var myConnection = mongoose.createConnection('localhost', 'faw');
var fawSchema = new Schema({
    word: String,
    length: Number,
    language: String
});

fawSchema.statics.getMinMaxLength = function (cb) {
    return this.aggregate({$group: {_id: "", min: {$min: "$length"}, max: {$max: "$length"}}}, cb);
}

fawSchema.statics.isWordExist = function (myWord, cb) {
    // retourne le mot ou null
    return this.findOne({word: myWord}, {word: 1, _id: 0}, cb);
}

module.exports = myConnection.model('word', fawSchema);