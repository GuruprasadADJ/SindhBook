const mongoose = require('mongoose');

const NoteSchema = mongoose.Schema({
    from_id       : String,
    from_relation : String,
    to_id         : String,
    to_relation   : String
});
module.exports = mongoose.model("temp_relative", NoteSchema);