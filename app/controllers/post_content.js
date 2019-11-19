const Post=require('../models/post.model.js');
const Note=require('../models/note.model.js');
exports.content_create = (req, res) => {
    var _id=req.body.id;
    if(!_id)
    {
        console.log("not found input");
        return res.status(200).send({message: "id is required "});
    }
    else
    {
        if(!req.body.contents){
            return res.status(200).send({message: "content is required "});
        }
    Note.find({ //checks weather the user_id exist in register table
    "_id": _id
    })
    .then(note => {
    if(!note) {
    return res.status(200).send({message: "database data not found with this id"}); 
    }
    else{
         const postcreate=new Post({
            user_id:_id,
            title:req.body.title||'',
            contents:req.body.contents, 
            created_at:new Date(),
            post_status:1
        },function(err,postcreate){
            if (err) return res.status(500).send({result:"failed",message:"There Was A problem Inserting Post",errorMessage:err.message});
        });
            postcreate.save()
            .then(data => {
                    res.status(200).send({result:"success",message:"content Posted Successfully",data:data});
            }).catch(err => {
                    res.status(500).send({result:"failed",message:"Not Inserted content",errorMessage: err.message || "Some error occurred while creating the Post."});
            });
        }
        }).catch(err => {
            res.status(500).send({
            result:"failed",message:"Not Registered",errorMessage: err.message || "Some error occurred while creating the Note."
        });
        });
    }
    }


//----------------------------------------------------------  POST CONTENT UPDATE     -------------------------------------------------    

exports.post_content_update = (req, res) => {
    var _id=req.body.id;
    var user_id=req.body.user_id;
    if(!_id ){
        console.log("not found input");
        return res.status(200).send({message: "id is required "});
    }
    else
    {
        if(!user_id){
            return res.status(200).send({message: "user_id is required "});
        }
    Note.find({ //checks weather the user_id exist in register table
    "_id": user_id
    })
    .then(note => {
         if(!note.length==0)
        {
        Post.find({
        "user_id":user_id,
        "_id": _id
        })
        .then(cont => {
            if(!cont.length==0)
            { 
                var title1=cont[0].title;
                var content1=cont[0].contents;
                const postupdate=Post.updateMany( //updates records in created record
                {user_id:user_id,
                _id:_id}, 
                {
                    title:req.body.title||title1,
                    contents:req.body.contents||content1,
                    modified_at: new Date()
                },function(err,postupdate) {
                      if (err){ return res.status(500).send({result:"failed",message:"There was a problem adding the information to the database."});
                }else{
                      res.status(200).send({result:"success",message:"content updated successfully",data:postupdate});
                } 
                }).catch(err => {
                    res.status(500).send({
                    result:"failed",message:"there was an error",errorMessage: err.message || "Some error occurred while creating the Note."
                });
                });
            }
            else{
                 res.status(200).send({result:'failed',message:'failed data not found in post table with this _id'});
            }
        })
    }
    else
    {
    res.status(200).send({result:'failed',message:'failed data not found in register table with this user _id'});
    }
    
    }).catch(err => {
    res.status(500).send({
    result:"failed",message:"Not Registered",errorMessage: err.message || "Some error occurred while creating the Note."
    });
    });
  }
}