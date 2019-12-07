const Post=require('../../models/post.model.js');
const Note=require('../../models/note.model.js');

exports.LikePost = (req, res) => {
var post_id=req.body.post_id;
var user_id=req.body.user_id;
if(post_id)
{   
    if(!user_id){
        res.status(200).send({result:"success",message:"Please enter user_id"});
    }
    
}
else{
    res.status(200).send({result:"success",message:"Please enter id"});
}
}
