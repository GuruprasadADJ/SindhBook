const mongoose = require('mongoose');

const NoteSchema = mongoose.Schema({
    user_id : String,
    requested_list :Array,
    accepted_list :Array,
    blocked_list:Array,
    blocked_by_others:Array,
    requested_by_me:Array,
    privacy:Number,
  });
module.exports = mongoose.model('friend1', NoteSchema);