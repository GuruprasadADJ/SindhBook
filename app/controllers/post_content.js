const Post1=require('../models/post.model.js');
const Note=require('../models/note.model.js');

var stream = require('stream');
const s3 = require('../config/s3.config.js');
var datetime = require('node-datetime');
var dt = datetime.create();
var formatted = dt.format('yyyy-MM-dd');


exports.createPost = (req, res) => {
    var _id=req.body.id;
    var file=req.files;
    console.log(req.body.id);
    // if(!_id)
    // {
    //     console.log("not found input");
    //     return res.status(200).send({message: "id is required "});
    // }
    // else
    // {
        //if(!file){
       //     return res.status(200).send({result:"failed",message: "id is required "});
       // }
        if(req.body.content)
        {
            Note.find({ //checks weather the user_id exist in register table
            "_id": _id
            })
            .then(note => {
            if(!note) {
            return res.status(200).send({result:"failed",message: "Data not found in registers table with this id"+ _id}); 
            }
            else
            {
                const postcreate=new Post1({
                    user_id:_id,
                    title:req.body.title||'',
                    contents:req.body.content, 
                    created_at:new Date(),
                    post_status:1
                },function(err,postcreate){
                    if (err) return res.status(500).send({result:"failed",message:"There Was A problem Inserting Post",errorMessage:err.message});
                });
                    postcreate.save()
                    .then(data => {
                            res.status(200).send({result:"success",message:"content Posted Successfully",data:data});
                    }).catch(err => {
                            res.status(500).send({result:"failed",message:"Exception",errorMessage: err.message || "Some error occurred while creating the Post."});
                    });
            }
            }).catch(err => {
                res.status(500).send({
                result:"failed",message:"Exception",errorMessage: err.message || "Some error occurred while creating the Note."
            });
            });
        }
        else if(req.files)
        {
            const s3Client = s3.s3Client;
            const params = s3.uploadParams;
            var flag=0;
            var file=req.files;
          
            file.map((item) => {
              params.Key = item.originalname;
              params.Body = item.buffer;
              s3Client.upload(params, (err, data) => {
                if (err) {
                  res.status(500).json({result:"failed",message:"Not Posted",error:"Error -> " + err});
                }
                else
                {
                  //ResponseData.push(data.Location);
                  const postuse=new Post1({
                    user_id:req.body.user_id,
                    title:req.body.title,
                    contents:data.Location,
                    created_at:new Date(),
                    post_status:1
                  },function(err,postuse){
                    if (err) return res.status(500).send({result:"failed",message:"There Was A problem Inserting Post",errorMessage:err.message});
                  });
                  postuse.save()
                  .then(data => {
                    res.status(200).send({result:"success",message:"Posted Successfully",data:data});
                  }).catch(err => {
                    res.status(500).send({result:"failed",message:"Exception",errorMessage: err.message || "Some error occurred while creating the Post."});
                  });
                }
              });
              });
        }
        else
        {
            res.status(200).send({result:"failed",message:"insert file or content"});
        }
   // }
    }
 

//==================================================   POST CONTENT UPDATE     ======================================================

exports.updatePost = (req, res) => {
    var _id=req.body.id;
    var user_id=req.body.user_id;
    if(!_id ){
        console.log("not found input");
        return res.status(200).send({result:"failed",message: "id is required "});
    }
    else
    {
      if(!user_id){
          return res.status(200).send({result:"failed",message: "user_id is required"});
      }

      if(req.body.content)
      {
          Post1.find({
            "user_id":user_id,
            "_id": _id
          })
          .then(cont => {
              if(!cont.length==0)
              { 
                  var title1=cont[0].title;
                  var content1=cont[0].contents;
                  const postupdate=Post1.updateMany( //updates records in created record
                  {user_id:user_id,
                  _id:_id}, 
                  {
                      title:req.body.title||title1,
                      contents:req.body.content||content1,
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
                    res.status(200).send({result:'failed',message:'not found in post table with this id'});
              }
          }).catch(err => {
              res.status(500).send({
              result:"failed",message:"there was an error",errorMessage: err.message || "Some error occurred while creating the Note."
            });
          });
      }
      else if(req.files)
      {
        Post1.find({
          "user_id":user_id,
          "_id": _id
        })
        .then(cont => {
            if(!cont.length==0)
            { 
              var title1=cont[0].title;
              var content1=cont[0].contents;

              const s3Client = s3.s3Client;
              const params = s3.uploadParams;
              var flag=0;
              var file=req.files;
        
              file.map((item) => {
              params.Key = item.originalname;
              params.Body = item.buffer;
              s3Client.upload(params, (err, data) => {
                if (err) {
                  res.status(500).json({result:"failed",message:"Not Posted",error:"Error -> " + err});
                }
                else
                {
                  //ResponseData.push(data.Location);
                  const postupdate=Post1.updateMany( //updates records in created record
                    {user_id:user_id,
                    _id:_id}, 
                    {
                        title:req.body.title||title1,
                        contents:data.Location||content1,
                        modified_at: new Date()
                    },function(err,postupdate) {
                          if (err){ return res.status(500).send({result:"failed",message:"There was a problem adding the information to the database."});
                    }else{
                          res.status(200).send({result:"success",message:"file updated successfully",data:postupdate});
                    } 
                    }).catch(err => {
                    res.status(500).send({result:"failed",message:"Exception",errorMessage: err.message || "Some error occurred while creating the Post."});
                  });
                }
              });
              });
          }
          else{
                res.status(200).send({result:'failed',message:'not found in post table with this id'});
          }
        }).catch(err => {
          res.status(500).send({result:"failed",message:"Exception",errorMessage: err.message || "Some error occurred while creating the Post."});
        });
      }
      else 
      {
          res.status(200).send({result:"failed",message:"insert file or content"});
      }
  }
}
    