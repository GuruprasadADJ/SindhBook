const mongoose = require('mongoose');

const NoteSchema = mongoose.Schema({
        //user_id
        user_id: String,
        user_name: String,
        title: String,
        content: String,
        images:Array,
        like:[
        {
                user_id:String,
                user_name:String,

        }
        ],
        comment:[
        {
                user_id:String,
                user_name:String,
                comment:String
        }
        ],
        post_status:Number,
        created_at: {type:Date, default:Date.Now},
        modified_at:{type:Date, default:Date.Now},
        deleted_at:{type:Date, default:Date.Now}
});
module.exports = mongoose.model('post', NoteSchema);