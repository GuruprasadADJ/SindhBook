const Note=require('../../models/note.model.js');
const Relative=require('../../models/Relative_models/relatives.model.js');
const moment = require('moment'); //to parse the default date of mongodb

exports.SendRelativeRequest = (req, res) => {    
    console.log("start......SendRelativeRequest");
var inputs=req.body;
var fromid=inputs.from_id;
var from_relation=inputs.from_relation;
var toid=inputs.to_id;
var to_relation=inputs.to_relation;
var deviceId=inputs.deviceId;
var json={};
var json1={};
if(fromid && toid)
{
    Note.find({
        "_id":  {
            "$in": [fromid, toid]
        }
    }).then(note=>{
       if(note.length==2)
       {    
            //console.log("entered in to note :",note)
            if(note[0].id==fromid)
            {
                json={};
                console.log("id_use=note[0].id=",note[0].id);
                json["id"]=note[0].id;
                json["user_name"]=note[0].first_name+" "+note[0].last_name;
                json["profile_picture"]=note[0].profile_picture;
                json["date"]=new Date();
                json["deviceId"]=deviceId;
                json["from_relation"]=to_relation;
                json["to_relation"]=from_relation;

                json1={};
                json1["id"]=note[1].id;
                json1["user_name"]=note[1].first_name+" "+note[1].last_name;
                json1["profile_picture"]=note[1].profile_picture;
                json1["date"]=new Date();
                json1["deviceId"]=deviceId;
                json1["from_relation"]=from_relation;
                json1["to_relation"]=to_relation;
            }
            else
            {
                json={};
                console.log("id_use=note[1].id=",note[1].id);
                json["id"]=note[1].id;
                json["user_name"]=note[1].first_name+" "+note[1].last_name;
                json["profile_picture"]=note[1].profile_picture;
                json["date"]=new Date();
                json["deviceId"]=deviceId;
                json["from_relation"]=to_relation;
                json["to_relation"]=from_relation;

                json1={};
                json1["id"]=note[0].id;
                json1["user_name"]=note[0].first_name+" "+note[0].last_name;
                json1["profile_picture"]=note[0].profile_picture;
                json1["date"]=new Date();
                json1["deviceId"]=deviceId;
                json1["from_relation"]=from_relation;
                json1["to_relation"]=to_relation;
            }

            if(note[0].id==fromid)
            {
                //update device token
                var device_array=[];
                device_array=(note[0].deviceId);            
                if(device_array.includes(deviceId)){
                    console.log("Token Found");
                }
                else if(device_array.length==0){
                    device_array.push(deviceId);
                    console.log("Token Not Found");
                    const updatedevice=Note.updateOne( 
                        {_id: fromid}, 
                        {deviceId: device_array}
                        ,function(err,updatedevice) {
                            console.log("Test");
                        if (err){ return res.status(500).send({result:"failed",message:"There was a problem adding the information to the database."});
                        }                           
                        }).catch(err => {
                            res.status(500).send({result:"failed",message:"There was an exception",errorMessage: err.message });
                        });
                        console.log("Test1");  
                }
                else{
                    device_array.push(deviceId);
                    console.log("Token Not Found");
                    const updatedevice=Note.updateOne( 
                        {_id: fromid}, 
                        {$set: { deviceId: device_array}}
                        ,function(err,updatedevice) {
                            console.log("Test");
                        if (err){ return res.status(500).send({result:"failed",message:"There was a problem adding the information to the database."});
                        }                           
                        }).catch(err => {
                            res.status(500).send({
                            result:"failed",message:"There was an exception1",errorMessage: err.message});
                        });
                        console.log("Test1");  
                }
            }
            else
            {
                //update device token
                var device_array=[];
                device_array=(note[1].deviceId);            
                if(device_array.includes(deviceId)){
                    console.log("Token Found");
                }
                else if(device_array.length==0){
                    device_array.push(deviceId);
                    console.log("Token Not Found");
                    const updatedevice=Note.updateOne( 
                        {_id: fromid}, 
                        {deviceId: device_array}
                        ,function(err,updatedevice) {
                            console.log("Test");
                        if (err){ return res.status(500).send({result:"failed",message:"There was a problem adding the information to the database."});
                        }                           
                        }).catch(err => {
                            res.status(500).send({result:"failed",message:"There was an exception2",errorMessage: err.message });
                        });
                        console.log("Test1");  
                }
                else{
                    device_array.push(deviceId);
                    console.log("Token Not Found");
                    const updatedevice=Note.updateOne( 
                        {_id: fromid}, 
                        {$set: { deviceId: device_array}}
                        ,function(err,updatedevice) {
                            console.log("Test");
                        if (err){ return res.status(500).send({result:"failed",message:"There was a problem adding the information to the database."});
                        }                           
                        }).catch(err => {
                            res.status(500).send({result:"failed",message:"There was an exception3",errorMessage: err.message});
                        });
                        console.log("Test1");  
                }
            }

/*****************************************************      CREATE RELATIVE REQUEST     ***********************************************************/           
            Relative.find({
                "user_id": toid
            }).then(request=>{
                console.log("Test2");
                if(request.length!=0)
                {
                    console.log("Test3");
                    var flag=0;
                    var request_list_array=[];
                    request_list_array=(request[0].r_requested_list);
                    var accepted_list=request[0].r_accepted_list
                    var blocked_list=request[0].r_blocked_list;
                    if(request_list_array.length==0 && accepted_list.length==0 && blocked_list.length==0)
                    {
                            request_list_array.push(json);
                            const updatedevice=Relative.updateOne(
                                {user_id: toid}, 
                                {
                                 r_requested_list:request_list_array
                                },function(err,updatedevice) {
                                   if (err){ return res.status(500).send({result:"failed",message:"There was a problem adding the information to the database."});
                                   }
                                   else
                                   {
                                   // return res.status(200).send({result:"success",message:"Sent friend request successfully"}); 
                                    //adds data also in from user record in requested by me
                                    Relative.find({
                                        "user_id": fromid
                                      }).then(request1=>{
                                        if(request1.length!=0)
                                        {
                                            console.log("if code");
                                            var requested_by_me=[];
                                            requested_by_me=(request1[0].r_requested_by_me);
                                            requested_by_me.push(json1);
                                            const updatedevice1=Relative.updateOne( 
                                                {user_id: fromid}, 
                                                {
                                                    r_requested_by_me:requested_by_me
                                                },function(err,updatedevice1) {
                                                   if (err){ return res.status(500).send({result:"failed",message:"There was a problem adding the information to the database."});
                                                   }
                                                   else
                                                   {
                                                    return res.status(200).send({result:"success",message:"Sent relative request successfully"}); 
                                                   }                           
                                                }).catch(err => {
                                                    res.status(500).send({result:"failed",message:"There was an exception3",errorMessage: err.message});
                                                });
                                        }
                                        else
                                        {
                                            console.log("else code");
                                            var requested_by_me=[];
                                            requested_by_me.push(json1);
                                            const trans1=new Relative({
                                                user_id : fromid,
                                                r_requested_by_me :requested_by_me,
                                                privacy:3,
                                            })
                                            trans1.save()
                                            .then(data=>{
                                                res.status(200).send({result:"success",message:"Sent relative request successfully"}); 
                                            }).catch(err => {
                                                res.status(500).send({
                                                  result:"failed",message:"There was an exception4",errorMessage: err.message || "Some error occurred while creating the Note."
                                            });
                                            });
                                        }
                                    }).catch(err => {
                                        res.status(500).send({
                                          result:"failed",message:"There was an exception",errorMessage: err.message});
                                    });
                                    //
                                   }                           
                                }).catch(err => {
                                    res.status(500).send({
                                      result:"failed",message:"There was an exception5",errorMessage: err.message});
                                });
                    }
                    else
                    {
                        var flag=0;
                        for(var i=0; i<request_list_array.length;i++)
                        {
                            console.log("Test44");
                            if(request_list_array[i].id==fromid){
                                flag=1;
                                return res.status(200).send({result:"success",message:"Already sent request"}); 
                            }
                        }
                        for(var i=0; i<accepted_list.length;i++)
                        {
                            if(accepted_list[i].id==fromid){
                                flag=1;
                                return res.status(200).send({result:"success",message:"Already Relative"});
                            }
                        }
                        for(var i=0; i<blocked_list.length;i++)
                        {
                            if(blocked_list[i].id==fromid){
                                flag=1;
                                return res.status(200).send({result:"success",message:"You are blocked by user"});
                            }
                        }
                        if(flag==1)
                        {

                        }
                        else
                        {
                            request_list_array.push(json);
                            const updatedevice=Relative.updateOne( 
                                {user_id: toid}, 
                                {
                                  r_requested_list:request_list_array
                                },function(err,updatedevice) {
                                   if (err){ return res.status(500).send({result:"failed",message:"There was a problem adding the information to the database."});
                                   }
                                      //return res.status(200).send({result:"success",message:"Sent friend request successfully"}); 
                                      //adds record also in from user record in requested by me 
                                      Relative.find({
                                        "user_id": fromid
                                      }).then(request1=>{
                                        if(request1.length!=0)
                                        {
                                            console.log("if code");
                                            var requested_by_me=[];
                                            requested_by_me=(request1[0].r_requested_by_me);
                                            requested_by_me.push(json1);
                                            const updatedevice1=Relative.updateOne( 
                                                {user_id: fromid}, 
                                                {
                                                    r_requested_by_me:requested_by_me
                                                },function(err,updatedevice1) {
                                                   if (err){ return res.status(500).send({result:"failed",message:"There was a problem adding the information to the database."});
                                                   }
                                                   else
                                                   {
                                                    return res.status(200).send({result:"success",message:"Sent relative request successfully"}); 
                                                   }                           
                                                }).catch(err => {
                                                    res.status(500).send({
                                                      result:"failed",message:"There was an exception6",errorMessage: err.message || "Some error occurred while creating the Note."
                                                });
                                                });
                                        }
                                        else
                                        {
                                            console.log("else code");
                                            var requested_by_me=[];
                                            requested_by_me.push(json1);
                                            const trans1=new Relative({
                                                user_id : fromid,
                                                r_requested_by_me :requested_by_me,
                                                privacy:3,
                                            })
                                            trans1.save()
                                            .then(data=>{
                                                res.status(200).send({result:"success",message:"Sent relative request successfully"}); 
                                            }).catch(err => {
                                                res.status(500).send({
                                                  result:"failed",message:"There was an exception7",errorMessage: err.message});
                                            });
                                        }
                                    }).catch(err => {
                                        res.status(500).send({
                                          result:"failed",message:"There was an exception8",errorMessage: err.message});
                                    });
                                                       
                                }).catch(err => {
                                    res.status(500).send({
                                      result:"failed",message:"There was an exception9",errorMessage: err.message});
                                });
                                
                        }
                    }
                }else{
                    console.log("Test4");
                    var request_list_array=[];
                    request_list_array.push(json);
                    const trans=new Relative({
                        user_id : toid,
                        r_requested_list :request_list_array,
                        privacy:3,
                    })
                    trans.save()
                    .then(data=>{
                        Relative.find({
                            "user_id": fromid
                            }).then(request1=>{
                            if(request1.length!=0)
                            {
                                var requested_by_me=[];
                                requested_by_me=(request1[0].r_requested_by_me);
                                requested_by_me.push(json1);
                                const updatedevice1=Relative.updateOne(
                                    {user_id: fromid}, 
                                    {
                                        r_requested_by_me:requested_by_me
                                    },function(err,updatedevice1) {
                                       if (err){ return res.status(500).send({result:"failed",message:"There was a problem adding the information to the database."});
                                       }
                                       else
                                       {
                                        return res.status(200).send({result:"success",message:"Sent relative request successfully"}); 
                                       }                           
                                    }).catch(err => {
                                        res.status(500).send({
                                          result:"failed",message:"There was an exception10",errorMessage: err.message });
                                    });
                            }
                            else
                            {
                                var requested_by_me=[];
                                requested_by_me.push(json1);
                                const trans1=new Relative({
                                    user_id : fromid,
                                    r_requested_by_me :requested_by_me,
                                    privacy:3,
                                })
                                trans1.save()
                                .then(data=>{
                                    res.status(200).send({result:"success",message:"Sent relative request successfully"}); 
                                }).catch(err => {
                                    res.status(500).send({
                                      result:"failed",message:"There was an exception11",errorMessage: err.message});
                                });
                            }
                        }).catch(err => {
                            res.status(500).send({
                              result:"failed",message:"There was an exception12",errorMessage: err.message});
                        });
                        //res.status(200).send({result:"success",message:"Friend request sent successfully",data:data}); 
                    }).catch(err => {
                        res.status(500).send({
                          result:"failed",message:"There was an exception13",errorMessage: err.message});
                    });
                }

            }).catch(err => {
                res.status(500).send({
                  result:"failed",message:"There was an exception14",errorMessage: err.message});
            });
        }
        else{
            res.status(200).send({result:"success",message:"from_id or to_id does not exist in register table"})
        }
        }).catch(err => {
            res.status(500).send({
              result:"failed",message:"There was an exception15",errorMessage: err.message });
        });
    }
}