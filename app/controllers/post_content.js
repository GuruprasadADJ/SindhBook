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
    if(!req.body.id){
      res.status(500).json({result:"Failed",message:"please enter valid id"});
    }
    else
    {
        console.log(req.body.id);
        if(req.body.content)
        {
            Note.find({ //checks weather the user_id exist in register table
            "_id": _id
            })
            .then(note => {
            if(!note) {
            return res.status(200).send({result:"Failed",message: "Data not found in database with this id "+ _id}); 
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
                    if (err) return res.status(500).send({result:"Failed",message:"There was a problem inserting data into database",errorMessage:err.message});
                });
                    postcreate.save()
                    .then(data => {
                            res.status(200).send({result:"Success",message:"content Posted Successfully",data:data});
                    }).catch(err => {
                            res.status(500).send({result:"Failed",message:"There was an exception",errorMessage: err.message || "Some error occurred while creating the Post."});
                    });
            }
            }).catch(err => {
                res.status(500).send({
                result:"Failed",message:"There was an exception",errorMessage: err.message || "Some error occurred while creating the Note."
            });
            });
        }
        else if(req.files)
        {
              const s3Client = s3.s3Client;
              const params = s3.uploadParams;
              var file=req.files; 
              var count=[];
              count=file;
          
              var ResponseData=[];
              console.log("function ok");
              file.map((item) => {
              params.Key = item.originalname;
              params.Body = item.buffer;
                
                s3Client.upload(params, (err, data) => {
                if (err) {
                  res.status(500).json({result:"failed",message:"Not Posted",error:"Error -> " + err});
                }
                else
                {
                  ResponseData.push(data.Location);
                }
                if(ResponseData.length==count.length)
                {
                  amazon();
                }
              
              });
            });
            function amazon()
            {      
                console.log("function executing");
                const postuse = new Post1({
                title:req.body.title,
                contents:ResponseData,
                user_id:req.body.id,
                created_at:new Date(),
                post_status:1
              },function(err,postuse){
                if (err) return res.status(500).send({result:"failed",message:"There Was A problem Inserting Post",errorMessage:err.message});
              });
              postuse.save()
              .then(data => {
                res.status(200).send({result:"success",message:"Posted Successfully",data:postuse});
              }).catch(err => {
                res.status(500).send({result:"failed",message:"Not Inserted Post",errorMessage: err.message || "Some error occurred while creating the post."});
              });
              ResponseData=[];
          }
        }
        else
        {
            res.status(200).send({result:"Failed",message:"Please insert File or Content"});
        }
    }
    }
 

//==================================================   POST CONTENT UPDATE     ======================================================

exports.updatePost = (req, res) => {
    var _id=req.body.id;
    var user_id=req.body.user_id;
    if(!_id ){
        console.log("not found input");
        return res.status(200).send({result:"Failed",message: "Please enter id "});
    }
    else
    {
      if(!user_id){
          return res.status(200).send({result:"Failed",message: "Please enter user_id"});
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
                        if (err){ return res.status(500).json({result:"Failed",message:"There was a problem inserting data into database",errorMessage: err.message});
                  }else{
                        res.status(200).send({result:"Success",message:"Data inserted successfully",data:postupdate});
                  } 
                  }).catch(err => {
                      res.status(500).send({
                      result:"Failed",message:"There was an exception",errorMessage: err.message || "Some error occurred while creating the Note."
                  });
                  });
              }
              else{
                    res.status(200).send({result:'Failed',message:'Data not found in database with this id '+user_id + "or" +_id});
              }
          }).catch(err => {
              res.status(500).send({
              result:"Failed",message:"There was an exception",errorMessage: err.message || "Some error occurred while creating the Note."
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
              var content1=[];
              content1=cont[0].contents;

              const s3Client = s3.s3Client;
              const params = s3.uploadParams;
              var file=req.files; 
              var count=[];
              count=file;
          
              var ResponseData=[];
              console.log("function ok");
              file.map((item) => {
              params.Key = item.originalname;
              params.Body = item.buffer;
                
                s3Client.upload(params, (err, data) => {
                if (err) {
                  res.status(500).json({result:"failed",message:"Not Posted",error:"Error -> " + err});
                }
                else
                {
                  ResponseData.push(data.Location);
                }
                if(ResponseData.length==count.length)
                {
                  amazon();
                }
              
              });
            });
            function amazon()
            {     var content2=[];
                  content2=content1;
                  for(var i=0;i<ResponseData.length;i++){
                    content2.push(ResponseData[i]);
                  }
                console.log("no of contents updating", content2);
                const postupdate=Post1.updateMany( //updates records in created record
                  {user_id:user_id,
                  _id:_id}, 
                  {
                      title:req.body.title||title1,
                      contents: content2||content1,
                      modified_at: new Date()
                  },function(err,postupdate) {
                        if (err){ return res.status(500).json({result:"Failed",message:"There was a problem inserting data into database",errorMessage: err.message});
                  }else{
                        res.status(200).send({result:"Success",message:"Data updated successfully",data:postupdate});
                  }
                  }).catch(err => {
                res.status(500).send({result:"Failed",message:"There is an exception",errorMessage: err.message || "Some error occurred while creating the post."});
              });
              ResponseData=[];
          }
          }
          else{
                res.status(200).send({result:'Failed',message:'data not found database with this id '+user_id +"or"+ _id});
          }
        }).catch(err => {
          res.status(500).send({result:"Failed",message:"There was an exception",errorMessage: err.message || "Some error occurred while creating the Post."});
        });
      }
      else 
      {
          res.status(200).send({result:"Failed",message:"Please insert File or Content"});
      }
  }
}
    