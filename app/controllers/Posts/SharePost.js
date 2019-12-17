const Post=require('../../models/post.model.js');
const Note=require('../../models/note.model.js');
var datetime = require('node-datetime');
var dt = datetime.create();

exports.SharePost = (req, res) => {
    var post_id=req.body.post_id;
    var from_id=req.body.from_id;
    var from_name='';
    var from_profile_picture='';
    var to_id=req.body.to_id;
    var to_name='';
    var to_profile_picture='';
    var deviceId=req.body.deviceId;
    var sharetitle=req.body.share_title;
    var json={};
    var json1={};
    var share_list=[];
    var share_list1=[];
    var title;
    var content;
    var images=[];
    var device_array=[];

    if(!from_id || !to_id || !post_id)
    {
        res.status(200).send({result:"success",message:"Please enter all ids"});
    } 
    else
    {
        Note.find({
            "_id":  {
                "$in": [from_id, to_id]
            }
        }).then(note=>{
            if(note[0].id==from_id)
            {
                device_array=note[0].deviceId;
            }
            else
            {
                device_array=note[1].deviceId;
            }
            if(device_array.includes(deviceId))
            {
                console.log("Token Found");
            }
            else if(device_array.length==0)
            {
                device_array.push(deviceId);
                console.log("Token Not Found");
                const updatedevice=Note.updateOne( 
                    {_id: from_id}, 
                    {deviceId: device_array}
                    ,function(err,updatedevice) {
                    if (err){ return res.status(500).send({result:"failed",message:"There was a problem adding the information to the database."});
                    }                           
                    }).catch(err => {
                        res.status(500).send({result:"failed",message:"There was an exception",errorMessage: err.message });
                    });
            }
            else
            {
                device_array.push(deviceId);
                console.log("Token Not Found");
                const updatedevice=Note.updateOne( 
                    {_id: from_id}, 
                    {$set: { deviceId: device_array}}
                    ,function(err,updatedevice) {
                    if (err){ return res.status(500).send({result:"failed",message:"There was a problem adding the information to the database."});
                    }                           
                    }).catch(err => {
                        res.status(500).send({result:"failed",message:"There was an exception",errorMessage: err.message });
                    }); 
            }
            if(from_id==to_id)
            {
                    json={};
                    json["from_id"]=from_id;

                    json["from_name"]=note[0].first_name+" "+note[0].last_name;
                    json["from_picture"]=note[0].profile_picture;
                    json["to_id"]=to_id;
                    json["to_name"]=note[0].first_name+" "+note[0].last_name;
                    json["to_picture"]=note[0].profile_picture;
                    json["share_id"]=from_id;
                    json["deviceId"]=deviceId;
                    json["share_date"]=new Date();
                    Post.find({
                    "_id": post_id,
                    "user_id":to_id
                    })
                    .then(cont => {
                        if(!cont.length==0)
                        { 
                            share_list=[];
                            share_list=cont[0].share;
                            share_list.push(json);
                            const postupdate=Post.updateMany( //updates records in created record
                            {_id:post_id,user_id:to_id}, 
                            {
                                share:share_list
                            },function(err,postupdate) {
                                if (err){ return res.status(500).json({result:"failed",message:"There was a problem inserting data into database",errorMessage: err.message});
                            }else{
                                res.status(200).send({result:"success",message:"Post shared successfully"});
                            } 
                            }).catch(err => {
                                res.status(500).send({
                                result:"failed",message:"There was an exception",errorMessage: err.message});
                            });
                        }
                        else{
                            res.status(200).send({result:'failed',message:'Data not found in database with this id1'});
                        }
                    }).catch(err => {
                        res.status(500).send({
                        result:"failed",message:"There was an exception",errorMessage: err.message});
                    });                  
            }
            else if(note.length==2)
            {
                Post.find({
                    "_id": post_id,
                    "user_id":to_id
                  })
                  .then(cont => {
                      if(cont.length!=0)
                      { 
                          console.log("Coming="+cont[0].content);
                          title=sharetitle;
                          content=cont[0].content;           
                          images=cont[0].images;
                            if(note[0].id==from_id)
                            {
                                share_post_data(note[0],note[1]);
                            }
                            else
                            {
                                share_post_data(note[1],note[0]);
                            }
                      }
                      else{
                            res.status(200).send({result:'failed',message:'Data not found in database with this id 2'});
                      }
                  }).catch(err => {
                      res.status(500).send({
                      result:"failed",message:"There was an exception",errorMessage: err.message});
                  });
                
                    
                    function share_post_data(note1,note2)
                    {
                        from_name=note1.first_name+" "+note1.last_name;
                        from_profile_picture=note1.profile_picture;
                        to_name=note2.first_name+" "+note2.last_name;
                        to_profile_picture=note2.profile_picture;
                        json={};
                        json["from_id"]=note1.id;
                        json["from_name"]=note1.first_name+" "+note1.last_name;
                        json["from_picture"]=note1.profile_picture;
                        json["to_id"]=note2.id;
                        json["to_name"]=note2.first_name+" "+note2.last_name;
                        json["to_picture"]=note2.profile_picture;
                        json["share_id"]=note1.id;
                        json["deviceId"]=deviceId;
                        json["share_date"]=new Date();
                        console.log("Test1");
                        json1={};
                        json1["from_id"]=note2.id;
                        json1["from_name"]=note2.first_name+" "+note2.last_name;
                        json1["from_picture"]=note2.profile_picture;
                        json1["to_id"]=note1.id;
                        json1["to_name"]=note1.first_name+" "+note1.last_name;
                        json1["to_picture"]=note1.profile_picture;
                        json1["share_id"]=note1.id;
                        json1["deviceId"]=deviceId;
                        json1["share_date"]=new Date();

                        Post.find({
                           "_id": post_id,
                           "user_id":to_id
                         }).then(cont => {
                             if(!cont.length==0)
                             { 
                                 share_list=[];
                                 share_list=cont[0].share;
                                 share_list.push(json1);
                                 const postupdate=Post.updateMany( //updates records in created record
                                 {_id:post_id,user_id:to_id}, 
                                 {
                                    share:share_list
                                 },function(err,postupdate) {
                                       if (err){ return res.status(500).json({result:"failed",message:"There was a problem inserting data into database",errorMessage: err.message});
                                 }
                                 }).catch(err => {
                                     res.status(500).send({
                                     result:"failed",message:"There was an exception",errorMessage: err.message});
                                 });
                            }
                            else{
                                    res.status(200).send({result:'failed',message:'Data not found in database with this id '});
                            }
                            }).catch(err => {
                                res.status(500).send({
                                result:"failed",message:"There was an exception",errorMessage: err.message});
                            });    
                                share_list1=[];
                                share_list1.push(json);
                                console.log("Coming1="+content+"\n Title="+title);
                                const postuse = new Post({
                                    user_id:note1.id,
                                    user_name:note1.first_name+" "+note1.last_name,
                                    title:title || '',
                                    content:content ||'',
                                    images:images,
                                    created_at:new Date(),
                                    post_status:1,
                                    deviceId:deviceId || '',
                                    share:share_list1,
                                    isShared:2,
                                    to_id:to_id,
                                    to_name:to_name,
                                    to_profile_picture:to_profile_picture,
                                    from_id:from_id,
                                    from_name:from_name,
                                    from_profile_picture:from_profile_picture
                                },function(err,postuse){
                                    if (err) return res.status(500).send({result:"failed",message:"There Was A problem Inserting Post",errorMessage:err.message});
                                });
                                postuse.save()
                                .then(data => {
                                    res.status(200).send({result:"success",message:"Posted Shared Successfully"});
                                }).catch(err => {
                                    res.status(500).send({result:"failed",message:"Not Inserted Post",errorMessage: err.message});
                                });                                
                    }
            }
            else{
                res.status(200).send({result:"success",message:"from_id or to_id does not exist in register table"})
            }
        }).catch(err => {
            res.status(500).send({result:"failed",message:"There was an exception",errorMessage: err.message});
        }); 
    } 
} 