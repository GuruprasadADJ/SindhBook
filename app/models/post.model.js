const mongoose = require('mongoose');

const NoteSchema = mongoose.Schema({
    //user_id
    user_id: String,
    title: String,
    file:Array,
    content: Array,
    created_at: {type:Date, default:Date.Now},
    modified_at:{type:Date, default:Date.Now},
    post_status:Number,
    deleted_at: {type:Date, default:Date.Now}
});
module.exports = mongoose.model('post', NoteSchema);