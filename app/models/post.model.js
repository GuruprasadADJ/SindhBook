const mongoose = require('mongoose');

const NoteSchema = mongoose.Schema({
        //user_id
        user_id: String,
        user_name:String,
        profile_picture:String,
        title: String,
        content: String,
        images:Array,
        post_status:Number,
        like:Array,
        comment:Array,
        share:Array,
        created_at: {type:Date, default:Date.Now},
        modified_at:{type:Date, default:Date.Now},
        deleted_at:{type:Date, default:Date.Now}
});
module.exports = mongoose.model('post', NoteSchema);