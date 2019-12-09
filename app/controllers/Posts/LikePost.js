const Post=require('../../models/post.model.js');
const Note=require('../../models/note.model.js');

exports.LikePost = (req, res) => {
var post_id=req.body.post_id;
var user_id=req.body.user_id;
if(post_id)
{   
    if(!user_id){
        res.status(200).send({result:"success",message:"Please enter user_id"});
    }

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
                if(data[0].like!=0){
                    var likes=data[0].like;
                    Console.log("likes..",likes);
                    var flag=0;
                    for(var i=0;i<likes.length;i++)
                    {
                        if(likes[i].user_id==user_id){
                            likes.splice(i,1);
                            flag=1;
                        }
                    }
                    if(flag==0){
                        likes.push(json);
                        const postupdate=Post.update( 
                            {_id:post_id}, 
                            {
                                like:likes
                            },function(err,postupdate) {
                                  if (err){ return res.status(500).json({result:"failed",message:"There was a problem inserting data into database",errorMessage: err.message});
                            }else{
                                  res.status(200).send({result:"success",message:"Liked post successfully"});
                            } 
                            }).catch(err => {
                                res.status(500).send({
                                result:"failed",message:"There was an exception",errorMessage: err.message});
                            });
                    }
                    else if(flag==1){
                    const postupdate=Post.update( 
                        {_id:post_id}, 
                        {
                            like:likes
                        },function(err,postupdate) {
                              if (err){ return res.status(500).json({result:"failed",message:"There was a problem inserting data into database",errorMessage: err.message});
                        }else{
                              res.status(200).send({result:"success",message:"Unliked post successfully"});
                        } 
                        }).catch(err => {
                            res.status(500).send({
                            result:"failed",message:"There was an exception",errorMessage: err.message});
                        });
                    }
                }
                else
                {
                    likes.push(json);
                    const postupdate=Post.update( 
                        {_id:post_id}, 
                        {
                            like:likes
                        },function(err,postupdate) {
                              if (err){ return res.status(500).json({result:"failed",message:"There was a problem inserting data into database",errorMessage: err.message});
                        }else{
                              res.status(200).send({result:"success",message:"Liked post successfully"});
                        } 
                        }).catch(err => {
                            res.status(500).send({
                            result:"failed",message:"There was an exception",errorMessage: err.message});
                        });
                }      
                    
            })
        }
        else{
            res.status(200).send({result:"success",message:"data not exit in register table"});
        }
    })


    
}
else{
    res.status(200).send({result:"success",message:"Please enter id"});
}
}
