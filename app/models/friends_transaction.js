const mongoose = require('mongoose');

const NoteSchema = mongoose.Schema({
    //user_id
    from_id: String,
    to_id: String,
    status:Number,
    date:{type:Date, default:Date.Now}
  });
module.exports = mongoose.model('friends_history', NoteSchema);