const Post1=require('../../models/post.model.js');
const Note=require('../../models/note.model.js');

exports.deletePost = (req, res) => {
    var post_id=req.body.id;
    var user_id=req.body.user_id;
    if(!post_id ){
        console.log("not found input");
        return res.status(200).send({result:"failed",message: "Please enter post_id "});
    }
    else
    {
        if(!user_id){
        res.status(200).send({result:"failed",message: "Please enter user_id"});
      }
        const postupdate=Post1.updateOne( //updates records in created record
            {_id:post_id,user_id:user_id}, 
            {   $set:{
                    post_status:2,
                    deleted_at:new Date()
                }
            },function(err,postupdate) {
                  if (err){ return res.status(500).json({result:"failed",message:"There was a problem while deleting the post",errorMessage: err.message});
            }else{
                  res.status(200).send({result:"success",message:"Post deleted successfully"});
                  console.log(".....post deleted successfully");
            } 
            }).catch(err => {
                res.status(500).send({
                result:"failed",message:"There is an exception",errorMessage: err.message});
            })
    }
}