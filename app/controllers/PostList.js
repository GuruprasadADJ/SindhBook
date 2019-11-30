const Post=require('../models/post.model.js');
const Note=require('../models/note.model.js');
const Friend=require('../models/friends.model.js');
const Privacy=require('../models/privacy.model.js');
var arraylist=[];
exports.postList = (req, res) => {
    arraylist=[];
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
            find_friend_post_id(input);
        }
    }).catch(err => {
        return res.status(200).send({result:'failed',message: "There is an exception ",errorMessage:err.message});
    })
    function find_friend_post_id(user_id)
    {
        var ids=[];
        var final_ids=[];
        final_ids.push(user_id);
        var status1;
        console.log("before adding final ids : ",final_ids);
        Friend.find({
            "from_id": user_id
        }).then(friend1=>{
            if(!friend1.length==0)
            {
                for(var i=0;i<friend1.length;i++)
                {
                    ids.push(friend1[i].to_id);
                }
                for(var i=0;i<ids.length;i++)
                {
                    var ids1;
                    ids1=ids[i];
                    Privacy.find({
                        "user_id": ids[i]
                    }).then(result=>{
                        if(result.length!=0)
                        {
                            status1=result[0].post;
                            console.log("data="+status1);
                            if(status1==1)
                            {
                                
                            }
                            else{
                                if(!final_ids.includes(result[0].user_id)){
                                    final_ids.push(result[0].user_id);
                                }
                            }
                        }
                        else{
                            if(!final_ids.includes(ids1)){
                                console.log("non privacy",ids1);
                                final_ids.push(ids1);
                            }
                        }
                        }).catch(err => {
                            res.status(500).send({
                            result:"failed",message:"There was an exception",errorMessage: err.message || "Some error occurred while creating the Note."
                        });
                        }); 
                }
            }
                Friend.find({
                    "to_id": user_id
                }).then(friend2=>{
                    if(!friend2.length==0){
                        for(var i=0;i<friend2.length;i++)
                        {
                            ids.push(friend2[i].from_id);
                        }
                        for(var i=0;i<ids.length;i++)
                        {
                            var ids1=ids[i];
                            Privacy.find({
                                "user_id": ids[i]
                            }).then(result=>{
                                if(result.length!=0)
                                {
                                    status1=result[0].post;
                                    console.log("data="+status1);
                                    if(status1==1)
                                    {
                                        
                                    }
                                    else{
                                        if(!final_ids.includes(result[0].user_id)){
                                            final_ids.push(result[0].user_id);
                                        }
                                    }
                                }
                                else{
                                    if(!final_ids.includes(ids1)){
                                        console.log("non privacy",ids1);
                                        final_ids.push(ids1);
                                    }
                                }
                            }).catch(err => {
                                res.status(500).send({
                                result:"failed",message:"There was an exception",errorMessage: err.message || "Some error occurred while creating the Note."
                            });
                            }); 
                        }
                        console.log("after adding final ids : ",final_ids)
                        post_data(final_ids);
                    }
                    else{
                        console.log("after adding final ids1 : ",final_ids)
                        post_data(final_ids);
                    }
                }).catch(err => {
                    res.status(500).send({
                    result:"failed",message:"There was an exception",errorMessage: err.message || "Some error occurred while creating the Note."
                    });
                });
            
        }).catch(err => {
            res.status(500).send({
              result:"failed",message:"There was an exception",errorMessage: err.message || "Some error occurred while creating the Note."
        });
        });
    }

    
    function post_data(final_ids)
    {
        var len;
        len=final_ids.length;
        if(len.length!=0)
        {
            Post.find({
                "user_id": {
                    "$in": final_ids
                }
            })
            .then(result=>{
                if(result.length!=0)
                {
                    for(var j=0;j<result.length;j++)
                    {
                        var json={};
                        json["title"]=result[j].title;
                        json["content"]=result[j].content;
                        json["images"]=result[j].images;
                        json["likes"]=result[j].like;
                        json["comments"]=result[j].comment;
                        json["created_at"]=result[j].created_at;
                        json["name"]=result[j].user_name;
                        arraylist.push(json); 
                        if(arraylist.length==result.length)
                        {
                            res.send({result:"success",message:"Posts found successfully",data:arraylist});
                            arraylist=[];
                        }
                    }   
                }
                else{
                    res.status(200).send({result:'success',message: "No posts found",data:[]});
                }
            }).catch(err => {
                res.status(500).send({
                    result:"failed",message:"There is an exception",errorMessage: err.message || "Some error occurred while creating the Note."
                });
            })
        }
        else{
            res.status(200).send({result:'success',message: "No posts found",data:[]});
        }
    }
} 