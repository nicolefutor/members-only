var mongoose = require('mongoose');

//Define a schema
var Schema = mongoose.Schema;

var userSchema = new Schema({
  name: {type: String, required: true},
  username: {type: String, required: true, unique: true},
  password: {type: String, required: true},
  ismember: {type: Boolean, default: false},
  isadmin: {type: Boolean, default: false}
});


// Compile model from schema
var User = mongoose.model('User', userSchema );

module.exports = User