const mongoose = require('mongoose');

const NoteSchema = mongoose.Schema({
        //user_id
        user_id: String,
        title: String,
        contents: Array,
        post_status:Number,
        like:[
        {
        user_id:String,
        }
        ],
        comment:[
        {
        user_id:String,
        comment:String
        }
        ],
        created_at: {type:Date, default:Date.Now},
        modified_at:{type:Date, default:Date.Now},
        deleted_at:{type:Date, default:Date.Now}
});
module.exports = mongoose.model('post', NoteSchema);