const Post=require('../../models/post.model');
const Note=require('../../models/note.model.js');
const Friend=require('../../models/Friends/friends.model1.js');
const Relative=require('../../models/Relative_models/relatives.model.js');
const Privacy=require('../../models/privacy.model.js');
var arraylist=[];
exports.postList = (req, res) => {
    console.log("start.....");
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
        //console.log("before adding final ids : ",final_ids);
        //function to retrive ids from to ids
        one_fromids()
        
        function one_fromids(){
            console.log("one_fromids()")
            Friend.find({
                "user_id": user_id
            }).then(friend1=>{
                if(friend1.length!=0){
                    var accepted_list=[];
                    accepted_list=friend1[0].accepted_list;
                    for(var i=0;i<accepted_list.length;i++)
                    {
                        final_ids.push(accepted_list[i].id);
                    }
                    two_fromids();
                }else{
                    two_fromids();
                }
            }).catch(err => {
                res.status(500).send({result:"failed",message:"There was an exception",errorMessage: err.message});
            });            
        }  
        function two_fromids(){
            console.log("two_fromids()")
            Relative.find({
                "user_id": user_id
            }).then(relative1=>{
                if(relative1.length!=0){
                    var accepted_list=[];
                    accepted_list=relative1[0].r_accepted_list;
                    console.log("accepted_list",accepted_list)
                    for(var i=0;i<accepted_list.length;i++)
                    {
                        final_ids.push(accepted_list[i].id);
                    }
                    post_data(final_ids);
                }else{
                    post_data(final_ids);
                }
            }).catch(err => {
                res.status(500).send({result:"failed",message:"There was an exception",errorMessage: err.message });
            });            
        }      
    }

//final function to fetch all posts against ids    
    function post_data(final_ids)
    {
        var len;
        len=final_ids.length;
        if(len.length!=0)
        {
            Post.find({
                "user_id": {
                    "$in": final_ids
                },
                "post_status":1
            })
            .then(result=>{
                if(result.length!=0)
                {
                    for(var j=0;j<result.length;j++)
                    {
                        var json={};
                        json["id"]=result[j].id;
                        json["user_id"]=result[j].user_id;
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
            })
            .catch(err => {
                res.status(500).send({
                    result:"failed",message:"There is an exception",errorMessage: err.message});
            })
        }
        else{
            res.status(200).send({result:'success',message: "No posts found",data:[]});
        }
    }
} 