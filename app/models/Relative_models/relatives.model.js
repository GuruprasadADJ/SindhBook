const mongoose = require('mongoose');

const NoteSchema = mongoose.Schema({
    user_id           : String,
    r_accepted_list     : Array,
    r_blocked_list      : Array,
    r_blocked_by_others : Array,
    r_requested_list    : Array,
    r_requested_by_me   : Array,
    r_privacy           : Number,
  
});
module.exports = mongoose.model("relative", NoteSchema);