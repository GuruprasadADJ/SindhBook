var stream = require('stream');
const Note = require('../models/note.model.js');
const s3 = require('../config/s3.config.js');
const Post=require('../models/post.model');

var datetime = require('node-datetime');
var ResponseData=[];
var dt = datetime.create();
var formatted = dt.format('yyyy-MM-dd');

 
exports.doUpload = (req, res) => {
  const s3Client = s3.s3Client;
  const params = s3.uploadParams;
  var file=req.files;
  var _id=req.body.id;

      if(!_id){
        console.log("not found input");
        return res.status(200).send({message: "id is required "});
      }
      else
      {
        Note.find({             //checks  weather the user_id exist in register table
          "_id": _id
        })
        .then(note => {
          if(!note) {
            return res.status(200).send({message: "database data not found with this id"});            
        }
        else{
          Post.find({          //checks wether the user_id exist in privacy table
            "user_id":_id
          }).then(post => {
            if(post.length==0)
            { 
                //aws file upload code
                file.map((item) => {
                params.Key = item.originalname;
                params.Body = item.buffer;
                s3Client.upload(params, (err, data) => {
                    if (err) {
                    // res.status(500).json({result:"failed",message:"Not Posted",error:"Error -> " + err});
                    }
                    else
                    {
                      // ResponseData.push(data.Location);
                      const postcreate=new Post({
                        user_id:_id,
                        title:req.body.title,
                        file:data.Location,
                        created_at:new Date(),
                        post_status:1
                      },function(err,postcreate){
                        if (err) return res.status(500).send({result:"failed",message:"There Was A problem Inserting Post",errorMessage:err.message});
                      });
                      postcreate.save()
                      .then(data => {
                        res.status(200).send({result:"success",message:"Posted Successfully",data:data});
                      // console.log("after inserting  : ",ResponseData);
                      }).catch(err => {
                        res.status(500).send({result:"failed",message:"Not Inserted Post",errorMessage: err.message || "Some error occurred while creating the Post."});
                      });
                      console.log("after inserting  : ",ResponseData);
                    }
                  });
                });
                //aws file upload code end               
            }
            else if(!post.length==0)
            { 
              var post=post[0];
              var file1=[];
              if(!post.file.length==0){
              file1=post.file;
              }else{}
            //aws file upload code
            file.map((item) => {
              params.Key = item.originalname;
              params.Body = item.buffer;
              s3Client.upload(params, (err, data) => {
                  if (err) {
                  // res.status(500).json({result:"failed",message:"Not Posted",error:"Error -> " + err});
                  }
                  else
                  {
                     file1.push(data.Location);
                     const postupdate=Post.updateMany( //updates records in created record
                      {user_id:_id}, 
                      {
                        title:req.body.title,
                        file:file1,
                        modified_at: new Date()
                      },function(err,postupdate) {
                          if (err){ return res.status(500).send({result:"failed",message:"There was a problem adding the information to the database."});
                          }else{
                              res.status(200).send({result:"success",message:"post updated successfully",data:postupdate});
                              file1=[];
                          }                             
                      }).catch(err => {
                              res.status(500).send({
                                result:"failed",message:"there was an error",errorMessage: err.message || "Some error occurred while creating the Note."
                        });
                      });
                  }
                });
              });
              //aws file upload code end  
            }
          });
        }
        }).catch(err => {
            res.status(500).send({
            result:"failed",message:"Not Registered",errorMessage: err.message || "Some error occurred while creating the Note."
          });
      });
    }
}


//------------------------------------------   POST CONTENT API    ------------------------------------------------------

exports.postcontent = (req, res) => {
  var _id=req.body.id;
      if(!_id){
        console.log("not found input");
        return res.status(200).send({message: "id is required "});
      }
      else
      {
        Note.find({             //checks  weather the user_id exist in register table
          "_id": _id
        })
        .then(note => {
          if(!note) {
            return res.status(200).send({message: "database data not found with this id"});            
        }
        else{
          Post.find({          //checks wether the user_id exist in privacy table
            "user_id":_id
          }).then(post => {
            if(post.length==0)
            { 
                const postcreate=new Post({
                  user_id:_id,
                  title:req.body.title,
                  content:req.body.content,
                  created_at:new Date(),
                  post_status:1
                },function(err,postcreate){
                  if (err) return res.status(500).send({result:"failed",message:"There Was A problem Inserting Post",errorMessage:err.message});
                });
                postcreate.save()
                .then(data => {
                  res.status(200).send({result:"success",message:"content Posted Successfully",data:data});
                // console.log("after inserting  : ",ResponseData);
                }).catch(err => {
                  res.status(500).send({result:"failed",message:"Not Inserted content",errorMessage: err.message || "Some error occurred while creating the Post."});
                });
            }
            else if(!post.length==0)
            { 
              var post=post[0];
              if(req.body.content)
              {
                var contents=[];
                if(!post.content.length==0){
                  contents=post.content;
                }else{};
                contents.push(req.body.content);
                const postupdate=Post.updateMany( //updates records in created record
                  {user_id:_id}, 
                  {
                    title:req.body.title,
                    content:contents,
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
                  contents=[];
              }
            }
          });
        }
        }).catch(err => {
            res.status(500).send({
            result:"failed",message:"Not Registered",errorMessage: err.message || "Some error occurred while creating the Note."
          });
      });
    }
}
