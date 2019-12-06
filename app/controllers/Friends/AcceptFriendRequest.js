const Note=require('../../models/note.model.js');
const Friend=require('../../models/Friends/friends.model1.js');
const moment = require('moment'); //to parse the default date of mongodb

exports.AcceptFriendRequest1 = (req, res) => {    
console.log("start......AcceptFriendRequest1");
var inputs=req.body;
var fromid=inputs.from_id;
var toid=inputs.to_id;
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
        if(note[0].id==fromid)
        {
            //update device token
            var device_array=[];
            device_array=(note[0].deviceId);
            console.log("device id="+device_array);            
            if(device_array.includes(deviceId)){
                console.log("Token Found1");
            }else if(device_array.length==0){
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
            else
            {
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
                        res.status(500).send({result:"failed",message:"There was an exception",errorMessage: err.message });
                    });
                    console.log("Test1");  
            }
        }
        else
        {
            //update device token
            var device_array=[];
            device_array=(note[1].deviceId);
            console.log("device id1="+device_array);             
            if(device_array.includes(deviceId)){
                console.log("Token Found2");
            }else if(device_array.length==0){
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
                        res.status(500).send({ result:"failed",message:"There was an exception",errorMessage: err.message  });
                    });
                    console.log("Test1");  
            }
            else
            {
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
                        res.status(500).send({ result:"failed",message:"There was an exception",errorMessage: err.message  });
                    });
                    console.log("Test1");  
            }
        }


            //create friend request
            Friend.find({
                "user_id":  {
                    "$in": [fromid, toid]
                }
            }).then(request=>{
                console.log("Test2");                
                if(request.length==2)
                {
                    if(request[0].user_id==fromid )
                    {
                        // code to insert requested list to accepted list
                        var request_list_array=[];
                        var accepted_list=[];
                        request_list_array=(request[0].requested_list);
                        accepted_list=(request[0].accepted_list);
                        for(var i=0; i<request_list_array.length;i++)
                        {
                            console.log("Test44");
                            if(request_list_array[i].id==toid)
                            {
                                json={};
                                json["id"]=request_list_array[i].id;
                                json["user_name"]=request_list_array[i].user_name;
                                json["profile_pic"]=request_list_array[i].profile_pic;
                                json["date"]=new Date();
                                json["deviceId"]=deviceId;
                                accepted_list.push(json);
                                
                                request_list_array.splice(i, 1);

                                const updatedevice=Friend.updateOne( 
                                    {user_id: fromid}, 
                                    {
                                    accepted_list:accepted_list,
                                    requested_list:request_list_array
                                    },function(err,updatedevice) {
                                    if (err){ return res.status(500).send({result:"failed",message:"There was a problem adding the information to the database."});
                                    }                         
                                    }).catch(err => {
                                        res.status(500).send({result:"failed",message:"There was an exception",errorMessage: err.message});
                                    });
                            }
                        }
                        // code to insert requested by me to accepted list
                        var requested_by_me=[];
                        var accepted_list1=[];
                        requested_by_me=(request[1].requested_by_me);
                        accepted_list1=(request[1].accepted_list);
                        for(var i=0; i<requested_by_me.length;i++)
                        {
                            console.log("Test44");
                            if(requested_by_me[i].id==fromid)
                            {
                                json1={};
                                json1["id"]=requested_by_me[i].id;
                                json1["user_name"]=requested_by_me[i].user_name;
                                json1["profile_pic"]=requested_by_me[i].profile_pic;
                                json1["date"]=new Date();
                                json1["deviceId"]=deviceId;
                                accepted_list1.push(json1);

                                requested_by_me.splice(i, 1);

                                const updatedevice=Friend.updateOne( 
                                    {user_id: toid}, 
                                    {
                                    accepted_list:accepted_list1,
                                    requested_by_me:requested_by_me
                                    },function(err,updatedevice) {
                                    if (err){ return res.status(500).send({result:"failed",message:"There was a problem adding the information to the database."});
                                    }
                                    else
                                    {
                                        return res.status(200).send({result:"success",message:"Accepted friend request successfully"}); 
                                    }                         
                                    }).catch(err => {
                                        res.status(500).send({ result:"failed",message:"There was an exception",errorMessage: err.message  });
                                    });
                            }
                        }
                    }                                      /************************************************ */
                    else if(request[1].user_id==fromid )   /************************************************ */
                    {
                        // code to insert requested list to accepted list
                        var request_list_array=[];
                        var accepted_list=[];
                        request_list_array=(request[1].requested_list);
                        accepted_list=(request[1].accepted_list);
                        for(var i=0; i<request_list_array.length;i++)
                        {
                            console.log("Test44");
                            if(request_list_array[i].id==toid)
                            {
                                json={};
                                json["id"]=request_list_array[i].id;
                                json["user_name"]=request_list_array[i].user_name;
                                json["profile_pic"]=request_list_array[i].profile_pic;
                                json["date"]=new Date();
                                json["deviceId"]=deviceId;
                                accepted_list.push(json);
                                
                                request_list_array.splice(i, 1);

                                const updatedevice=Friend.updateOne( 
                                    {user_id: fromid}, 
                                    {
                                        accepted_list:accepted_list,
                                        requested_list:request_list_array
                                    },function(err,updatedevice) {
                                    if (err){ return res.status(500).send({result:"failed",message:"There was a problem adding the information to the database."});
                                    }                         
                                    }).catch(err => {res.status(500).send({ result:"failed",message:"There was an exception",errorMessage: err.message});
                                    });
                            }
                        }
                        // code to insert requested by me to accepted list
                        var requested_by_me=[];
                        var accepted_list1=[];
                        requested_by_me=(request[0].requested_by_me);
                        accepted_list1=(request[0].accepted_list);
                        for(var i=0; i<requested_by_me.length;i++)
                        {
                            console.log("Test44");
                            if(requested_by_me[i].id==fromid)
                            {
                                json1={};
                                json1["id"]=requested_by_me[i].id;
                                json1["user_name"]=requested_by_me[i].user_name;
                                json1["profile_pic"]=requested_by_me[i].profile_pic;
                                json1["date"]=new Date();
                                json1["deviceId"]=deviceId;
                                accepted_list1.push(json1);

                                requested_by_me.splice(i, 1);

                                const updatedevice=Friend.updateOne( 
                                    {user_id: toid}, 
                                    {
                                        accepted_list:accepted_list1,
                                        requested_by_me:requested_by_me
                                    },function(err,updatedevice) {
                                    if (err){ return res.status(500).send({result:"failed",message:"There was a problem adding the information to the database."});
                                    }
                                    else
                                    {
                                        return res.status(200).send({result:"success",message:"Accepted friend request successfully"}); 
                                    }                          
                                    }).catch(err => {
                                        res.status(500).send({result:"failed",message:"There was an exception",errorMessage: err.message});
                                    });
                            }
                        }
                    }
                }
                else{
                    res.status(200).send({result:"success",message:"from_id or to_id does not exist in friend table"})
                }
            }).catch(err => {
                res.status(500).send({result:"failed",message:"There was an exception",errorMessage: err.message});
            });
        }
        else{
            res.status(200).send({result:"success",message:"from_id or to_id does not exist in register table"})
        }
        }).catch(err => {
            res.status(500).send({result:"failed",message:"There was an exception",errorMessage: err.message});
        });
    }
}