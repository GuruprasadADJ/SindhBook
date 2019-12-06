const mongoose = require('mongoose');

const NoteSchema = mongoose.Schema({
    user_id: String,
    post:Number,
    about:Number,
    profile:Number,
    deviceId:String
});
module.exports = mongoose.model("privacy", NoteSchema);