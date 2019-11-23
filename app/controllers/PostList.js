const Post=require('../models/post.model.js');
const Note=require('../models/note.model.js');

exports.postList = (req, res) => {
    var arraylist=[];
    var input=req.params.postId;
    Note.findById(req.params.postId)
    .then(note=>{
        if(!note){
            return res.status(200).send({result:'Failed',
                message: "Data not found in database with this id " + req.params.postId
            });
        }
        else
        {
            var name=note.first_name+" "+note.last_name;
            Post.find({         
                "user_id": input
            }).then(post=>{
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
                        Post.find({
                            "_id": ids[i]
                        })
                        .then(result=>{
                            var json={};
                               console.log("result.length ::",result.length);
                               console.log(result[0]);
                                json["title"]=result[0].title;
                                json["contents"]=result[0].contents;
                                json["likes"]=result[0].like;
                                json["comments"]=result[0].comment;
                                json["created_at"]=result[0].created_at;
                                json["name"]=name;
                                arraylist.push(json);
                                if(arraylist.length==ids.length)
                                {
                                    console.log("arraylist:",arraylist);
                                    res.send({result:"Success",message:"Data found successfully",data:arraylist});
                                }
                        }).catch(err => {
                            res.status(500).send({
                                result:"Failed",message:"There was an exception",errorMessage: err.message || "Some error occurred while creating the Note."
                            });
                        })
                    }
                }
                else
                {
                    return res.status(200).send({result:'Failed',message: "No posts found"});
                }
            }).catch(err => {
                res.status(500).send({
                    result:"Failed",message:"There was an exception",errorMessage: err.message || "Some error occurred while creating the Note."
                });
            })
        }
    }).catch(err => {
        return res.status(200).send({result:'Failed',
                message: "Data not found in database with this id " + req.params.postId});
    })
} 