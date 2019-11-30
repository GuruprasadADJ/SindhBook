const mongoose = require('mongoose');

const NoteSchema = mongoose.Schema({
    user_id           : String,
    accepted_list     :Array,
    bloked_list       :Array,
    requests_to_me     :Array,
    privacy : Number,
  
});
module.exports = mongoose.model("relative", NoteSchema);