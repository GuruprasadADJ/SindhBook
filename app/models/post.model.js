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
        deleted_at:{type:Date, default:Date.Now},
        deviceId:String,
        isShared : Number,
        to_id:String,
        to_name:String,
        to_profile_picture:String,
        from_id:String,
        from_name:String,
        from_profile_picture:String
});
module.exports = mongoose.model('post', NoteSchema);