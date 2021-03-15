var mongoose = require('mongoose');
var format = require('date-fns/format')
var toDate = require('date-fns/toDate')

//Define a schema
var Schema = mongoose.Schema;

var messageSchema = new Schema({
  user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
  },
  title: {type: String, required: true},
  body: {type: String, required: true},
  timestamp: {type: Date, default: Date.now}
});

messageSchema.virtual('time').get(function() {
  let date = toDate(this.timestamp)
  return format(date, 'MM/dd/yyyy, h:mm')
})

// Compile model from schema
var Message = mongoose.model('Message', messageSchema );

module.exports = Message