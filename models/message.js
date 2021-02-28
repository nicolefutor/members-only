var mongoose = require('mongoose');

//Define a schema
var Schema = mongoose.Schema;

var meesageSchema = new Schema({
  user: {
      type: Schema.Types.ObjectId,
      ref: 'User'
  },
  title: {type: String, required: true},
  text: {type: String, required: true},
  timestamp: {type: Date, default: Date.now}
});


// Compile model from schema
var Message = mongoose.model('Message', messageSchema );

module.exports = Message