const Post=require('../models/post.model.js');
const Note=require('../models/note.model.js');

exports.postList = (req, res) => {
    var arraylist=[];
    var input=req.params.postId;
    Note.findById(req.params.postId)
    .then(note=>{
        if(!note){
            return res.status(200).send({result:'failed',
                message: "Data not found in register table" + req.params.postId
            });
        }
        else
        {
            Post.find({          //checks wether the user_id exist in privacy table
                "user_id": input
            }).then(post=>{
                if(!post.length==0)
                {
                    var ids=[];
                    var user_ids=[];
                    for(var i=0;i<post.length; i++)
                    {
                        ids.push(post[i].id)
                        user_ids.push(post[i].user_id);
                    }
                     console.log("all ids  : ",ids);
                     one(ids,user_ids);
                     
                }
                else
                {
                    return res.status(200).send({result:'failed',message: "no post yet" });
                }
            }).catch(err => {
                res.status(500).send({
                    result:"failed",message:"Exception",errorMessage: err.message || "Some error occurred while creating the Note."
                });
            })
        }
    }).catch(err => {
        return res.status(200).send({result:'failed',
                message: "Data not found in register table  " + req.params.postId});
    })

function one(ids,user_ids)
{ 
    console.log("ids length="+ids.length);
    var first_name=[],last_name=[];
    for(var j=0;j<user_ids.length;j++)
    {
        Note.find({
            "_id": user_ids[j]
        }).then(result1=>{
            first_name.push(result1[0].first_name);
            last_name.push(result1[0].last_name);
    })   
    }
        var json={};
        Post.find({
                "_id": {"$in":ids}
            })
            .then(result=>{
                console.log("result.length ::",result.length);
                for(var i=0;i<result.length;i++)
                {   
                        json["title"]=result[i].title;
                        json["contents"]=result[i].contents;
                        json["likes"]=result[i].like;
                        json["comments"]=result[i].comment;
                        json["created_at"]=result[i].created_at;
                        json["first_name"]=first_name[i];
                        json["last_name"]=last_name[i];
                        arraylist.push(json);
                 }             
            res.send({result:"success",message:"ok",data:arraylist});
            });
        }
    } 