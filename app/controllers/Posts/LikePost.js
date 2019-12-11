const Post=require('../../models/post.model.js');
const Note=require('../../models/note.model.js');
const Friend=require('../../models/Friends/friends.model1.js');
const Relative=require('../../models/Relative_models/relatives.model.js');
const Privacy=require('../../models/privacy.model.js');
const moment = require('moment');
const load_data=require('lodash');

exports.LikePost = (req, res) => {
var post_id=req.body.post_id;
var user_id=req.body.user_id;
if(post_id)
{   
    if(!user_id)
    {
        res.status(200).send({result:"success",message:"Please enter user_id"});
    }
    else
    {
    Note.find({
        "_id":user_id
    }).then(data=>{
        if(data.length!=0)
        {
            var json={};
            json["user_id"]=user_id;
            json["user_name"]=data[0].first_name+" "+data[0].last_name;
            json["profile_picture"]=data[0].profile_picture;
            json["date"]=new Date();
            json["deviceId"]=req.body.deviceId;

            /***********inserts user details in like column in post table */

            Post.find({
                "_id":post_id
            }).then(data=>{
                var likes=[];
                if(data[0].like!=0){
                    var likes=data[0].like;
                    console.log("likes..",likes);
                    var flag=0;
                    for(var i=0;i<likes.length;i++)
                    {
                        if(likes[i].user_id==user_id){
                            likes.splice(i,1);
                            flag=1;
                        }
                    }
                    if(flag==0){
                        insert_deviceId();
                        likes.push(json);
                        const postupdate=Post.update( 
                            {_id:post_id}, 
                            {
                                like:likes
                            },function(err,postupdate) {
                                  if (err){ return res.status(500).json({result:"failed",message:"There was a problem inserting data into database",errorMessage: err.message});
                            }else{
                                  //res.status(200).send({result:"success",message:"Liked post successfully"});
                                  getPostList(user_id,"Liked post successfully");
                            } 
                            }).catch(err => {
                                res.status(500).send({
                                result:"failed",message:"There was an exception",errorMessage: err.message});
                            });
                    }
                    else if(flag==1){
                        insert_deviceId();
                    const postupdate=Post.update( 
                        {_id:post_id}, 
                        {
                            like:likes
                        },function(err,postupdate) {
                              if (err){ return res.status(500).json({result:"failed",message:"There was a problem inserting data into database",errorMessage: err.message});
                        }else{
                              //res.status(200).send({result:"success",message:"Unliked post successfully"});
                              getPostList(user_id,"Unliked post successfully");
                        } 
                        }).catch(err => {
                            res.status(500).send({
                            result:"failed",message:"There was an exception",errorMessage: err.message});
                        });
                    }
                }
                else
                {
                    insert_deviceId();
                    likes.push(json);
                    const postupdate=Post.update( 
                        {_id:post_id}, 
                        {
                            like:likes
                        },function(err,postupdate) {
                              if (err){ return res.status(500).json({result:"failed",message:"There was a problem inserting data into database",errorMessage: err.message});
                        }else{
                              //res.status(200).send({result:"success",message:"Liked post successfully"});
                              getPostList(user_id,"Liked post successfully");
                        } 
                        }).catch(err => {
                            res.status(500).send({
                            result:"failed",message:"There was an exception",errorMessage: err.message});
                        });
                }      
                    
            })
            function insert_deviceId()
            {
                var device_array=[];
                device_array=(data[0].deviceId);
                console.log("device id="+device_array);            
                if(device_array.includes(req.body.deviceId)){
                    console.log("Token Found1="+data[0]._id);
                }else if(device_array.length==0){
                    device_array.push(req.body.deviceId);
                    console.log("Token Not Found="+data[0]._id);
                    const updatedevice=Note.updateOne( 
                        {_id: data[0]._id}, 
                        {deviceId: device_array}
                        ,function(err,updatedevice) {
                            console.log("Test");
                        if (err){ return res.status(500).send({result:"failed",message:"There was a problem adding the information to the database."});
                        }                           
                        }).catch(err => {
                            res.status(500).send({result:"failed",message:"There was an exception",errorMessage: err.message });
                        }); 
                }
                else
                {
                    device_array.push(req.body.deviceId);
                    console.log("Token Not Found");
                    const updatedevice=Note.updateOne( 
                        {_id: data[0]._id}, 
                        {$set: { deviceId: device_array}}
                        ,function(err,updatedevice) {
                            console.log("Test");
                        if (err){ return res.status(500).send({result:"failed",message:"There was a problem adding the information to the database."});
                        }                           
                        }).catch(err => {
                            res.status(500).send({result:"failed",message:"There was an exception",errorMessage: err.message });
                        });
                        console.log("Test1");  
                }
            }
            function getPostList(user_id,message_use)
            {
                arraylist=[];
                var input=user_id;
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
                                Privacy.find({
                                    "user_id": final_ids
                                }).then(privacy_data=>{
                                    for(var j=0;j<privacy_data.length;j++)
                                    {
                                        if(privacy_data[j].post==3 || privacy_data[j].post==2)
                                        {

                                        }
                                        else
                                        {
                                            var index = final_ids.indexOf(privacy_data[j].id);
                                            final_ids.splice(index, 1);
                                        }
                                    }
                                    two_fromids();
                                }).catch(err => {
                                    res.status(500).send({result:"failed",message:"There was an exception",errorMessage: err.message});
                                }); 
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
                                Privacy.find({
                                    "user_id": final_ids
                                }).then(privacy_data=>{
                                    for(var j=0;j<privacy_data.length;j++)
                                    {
                                        if(privacy_data[j].post==3 || privacy_data[j].post==2)
                                        {

                                        }
                                        else
                                        {
                                            var index = final_ids.indexOf(privacy_data[j].id);
                                            final_ids.splice(index, 1);
                                        }
                                    }
                                    post_data(final_ids);
                                }).catch(err => {
                                    res.status(500).send({result:"failed",message:"There was an exception",errorMessage: err.message});
                                }); 
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
                        }).sort({created_at: -1})
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
                                    json["share"]=result[j].share;
                                    let d4=moment(result[j].created_at);
                                    json["created_at"]=d4.format("DD-MM-YYYY h:mm:ss a");
                                    json["name"]=result[j].user_name;
                                    var result_index=load_data.findIndex(result[j].like, function(o) { return o.user_id == input })
                                    if(result_index>=0)
                                    {
                                        json["like_status"]=1;
                                    }
                                    else
                                    {
                                        json["like_status"]=2;
                                    }
                                    arraylist.push(json); 
                                    if(arraylist.length==result.length)
                                    {
                                        res.send({result:"success",message:message_use,data:arraylist});
                                        arraylist=[];
                                    }
                                }
                            }
                            else{
                                res.status(200).send({result:'success',message: message_use,data:[]});
                            }
                        })
                        .catch(err => {
                            res.status(500).send({
                                result:"failed",message:"There is an exception",errorMessage: err.message});
                        })
                    }
                    else{
                        res.status(200).send({result:'success',message: message_use,data:[]});
                    }
                }
            }
            }
            else
            {
                res.status(200).send({result:"success",message:"data not exit in register table"});
            }
        })
    }    
  }
    else
    {
        res.status(200).send({result:"success",message:"Please enter post_id"});
    }
}
