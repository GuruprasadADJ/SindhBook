const Post=require('../models/post.model.js');
const Note=require('../models/note.model.js');

exports.postList = (req, res) => {
    var arraylist=[];
    var input=req.params.postId;
    Note.find({"_id":input})
    .then(note=>{
        if(!note){
            return res.status(200).send({result:'success',
                message: "Data not found in database with this id " + req.params.postId
            });
        }
        else
        {   
            var name=note[0].first_name+" "+note[0].last_name;
            console.log("my name is : ",name);
            Post.find({         
                "user_id": input
            }).then(post=>{
                console.log("post  : ",post)
                if(!post.length==0)
                {
                    var ids=[];
                    for(var i=0;i<post.length; i++)
                    {
                        ids.push(post[i].id)
                    }
                    console.log("all ids  : ",ids);
                    console.log("ids length="+ids.length);
                    
                    for(var i=0;i<ids.length;i++)
                    {
                        Post.findById(ids[i])
                        .then(result=>{
                            console.log("result   :",result)
                            var json={};
                            //    console.log("result.length ::",result.length);
                            //    console.log(result[0]);
                                json["title"]=result.title; 
                                json["content"]=result.content;
                                json["images"]=result.images;
                                json["likes"]=result.like;
                                json["comments"]=result.comment;
                                json["created_at"]=result.created_at;
                                json["name"]=name;
                                arraylist.push(json);
                                if(arraylist.length==ids.length)
                                {
                                    console.log("arraylist:",arraylist);
                                    res.send({result:"success",message:"Posts found successfully",data:arraylist});
                                }
                        }).catch(err => {
                            res.status(500).send({
                                result:"failed",message:"There is an exception",errorMessage: err.message || "Some error occurred while creating the Note."
                            });
                        })
                    }
                }
                else
                {
                    return res.status(200).send({result:'success',message: "No posts found",data:post});
                }
            }).catch(err => {
                res.status(500).send({
                    result:"failed",message:"There is an exception",errorMessage: err.message || "Some error occurred while creating the Note."
                });
            })
        }
    }).catch(err => {
        return res.status(200).send({result:'failed',
                message: "There is an exception ",errorMessage:err.message});
    })
} 