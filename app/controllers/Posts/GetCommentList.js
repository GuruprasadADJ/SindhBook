const Post=require('../../models/post.model.js');
const moment = require('moment');

exports.GetComments = (req, res) => {
        var arraylist=[];
        var post_id=req.params.postId;
        var comments=[];
        Post.find({ 
            "_id":post_id 
        }).then(post=>{
            if(post.length!=0)
            {
              comments=post[0].comment;
              return res.status(200).send({result:'success',message: "Post comments",data:comments});
            }
            else
            {
                return res.status(200).send({result:'success',message: "No comments found for this post",data:comments}); 
            }
        }).catch(err => {
            return res.status(200).send({result:'failed',
            message: "There is an exception ",errorMessage:err.message});
        })
}