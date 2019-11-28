const Post=require('../models/post.model.js');
const Note=require('../models/note.model.js');
const Friend=require('../models/friends.model.js');
const Privacy=require('../models/privacy.model.js');

exports.getProfileDetails = (req, res) => {
    var arraylist=[];
    var user_id=req.body.user_id;
    var friend_id=req.body.friend_id;
    var f_status;
    var p_status;
    var show_data;
    Note.find({
        "_id":  {
            "$in": [user_id, friend_id]
        }
    }).then(note=>{
        if(note.length==0){
            return res.status(200).send({result:'success',
                message: "Data not found in database with this user id or friend id "
            });
        }
        else
        {
            console.log("Test1");
            find_friend_status(user_id,friend_id,function(response){
                f_status=response;
                console.log("f_status",response);            
                show_result(p_status,f_status,name,note[0].profile_picture);
            });
            find_privacy_status(friend_id,function(response){
                console.log("p_status",response);
                p_status=response;
            });
            var name=note[0].first_name+" "+note[0].last_name;
                  
        }
    }).catch(err => {
        return res.status(200).send({result:'failed',
                message: "There is an exception ",errorMessage:err.message});
    })

    function find_friend_status(user_id,friend_id,callback)
    {
        console.log("Test2");
        var status=0;
        Friend.find({
            "from_id": user_id,
            "to_id": friend_id
        }).then(friend1=>{
            if(!friend1.length==0){
                status=friend1[0].status;
                return callback(status);
            }
            else{
                Friend.find({
                    "from_id": friend_id,
                    "to_id": user_id
                }).then(friend2=>{
                    if(!friend2.length==0){
                        status=friend2[0].status;
                        return callback(status);
                    }
                    else
                    {
                        return callback(status);
                    }
                }).catch(err => {
                    res.status(500).send({
                      result:"failed",message:"There was an exception",errorMessage: err.message || "Some error occurred while creating the Note."
                    });
                });
            }
        }).catch(err => {
            res.status(500).send({
              result:"failed",message:"There was an exception",errorMessage: err.message || "Some error occurred while creating the Note."
        });
        });
    }
    function find_privacy_status(friend_id,callback)
    {
        console.log("Test3");
        var status1=0;
        Privacy.find({
            "user_id": friend_id
        }).then(result=>{
            if(!result.length==0){
                status1=result[0].post;
                return callback(status1);
            }
            else{
                return callback(status1);
            }
            }).catch(err => {
                res.status(500).send({
                result:"failed",message:"There was an exception",errorMessage: err.message || "Some error occurred while creating the Note."
            });
            });
    }
    function show_result(p_status,f_status,name,profile_picture)
    {
        console.log(p_status+" "+f_status);
        if(p_status==1)
        {
            show_data=0;
        }
        else if(p_status==3)
        {
            show_data=1;
        }
        else if(p_status==2)
        {
            if(f_status==2)
            {
                show_data=1;
            }
            else
            {
                show_data=0;
            }
        }
        else
        {
                show_data=1;
        }
        if(show_data==0)
        {
            return res.status(200).send({result:'success',
                        message: "User Profile Details",user_name:name,profile_picture:profile_picture,Post_Details:"No Data Found"});
        }
        else
        {
            Post.find({         
                "user_id":{"$in" :  friend_id }
            }).then(post=>{
                for(var i=0;i<post.length;i++){
                    var json={};
                    json["title"]=post[i].title;
                    json["content"]=post[i].content;
                    json["images"]=post[i].images;
                    json["likes"]=post[i].like;
                    json["comments"]=post[i].comment;
                    json["created_at"]=post[i].created_at;
                    json["name"]=name;
                    arraylist.push(json); 
                };
                return res.status(200).send({result:'success',
                        message: "User Profile Details",user_name:name,profile_picture:profile_picture,Post_Details:arraylist});
            }).catch(err => {
                return res.status(200).send({result:'failed',
                        message: "There is an exception ",errorMessage:err.message});
            })
        }     
    }    
}