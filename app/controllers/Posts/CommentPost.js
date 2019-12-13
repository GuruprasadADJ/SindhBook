const Post=require('../../models/post.model.js');
const Note=require('../../models/note.model.js');

exports.CommentPost = (req, res) => {
var post_id=req.body.post_id;
var user_id=req.body.user_id;
var comment=req.body.comment;
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
            json["comment"]=comment;
            json["date"]=new Date();
            json["deviceId"]=req.body.deviceId;

            /***********inserts user details in like column in post table */

            Post.find({
                "_id":post_id,
            }).then(data=>{
                if(data.length==0)
                {
                    res.status(500).send({result:"failed",message:"No post id found in database"});
                }
                else
                {
                    var comments=[];
                    if(data[0].comment!=0){
                    var comments=data[0].comment;
                    var flag=0;
                    comments.push(json);
                    insert_deviceId();
                    const postupdate=Post.update( 
                        {_id:post_id}, 
                        {
                            comment:comments
                        },function(err,postupdate) {
                              if (err){ return res.status(500).json({result:"failed",message:"There was a problem inserting data into database",errorMessage: err.message});
                        }else{
                              res.status(200).send({result:"success",message:"comment post successfully",data:comments});
                        } 
                        }).catch(err => {
                            res.status(500).send({
                            result:"failed",message:"There was an exception",errorMessage: err.message});
                        });
                }
                else
                {
                    insert_deviceId();
                    comments.push(json);
                    const postupdate=Post.update( 
                        {_id:post_id}, 
                        {
                            comment:comments
                        },function(err,postupdate) {
                              if (err){ return res.status(500).json({result:"failed",message:"There was a problem inserting data into database",errorMessage: err.message});
                        }else{
                              res.status(200).send({result:"success",message:"Comment post successfully",data:comments});
                        } 
                        }).catch(err => {
                            res.status(500).send({
                            result:"failed",message:"There was an exception",errorMessage: err.message});
                        });
                }      
            }   
            }).catch(err => {
                res.status(500).send({result:"failed",message:"There was an exception",errorMessage: err.message });
            });
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
            }
            else
            {
                res.status(200).send({result:"success",message:"data not exit in register table"});
            }
        }).catch(err => {
            res.status(500).send({result:"failed",message:"There was an exception",errorMessage: err.message });
        });
    }    
  }
    else
    {
        res.status(200).send({result:"success",message:"Please enter post_id"});
    }
}
