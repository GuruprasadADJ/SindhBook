const Note=require('../../models/note.model.js');
const Relative=require('../../models/Relative_models/relatives.model.js');
const moment = require('moment'); //to parse the default date of mongodb
const another=require('../General/Notification.js');

exports.AcceptRelativeRequest = (req, res) => {    
    console.log("start......");
var inputs=req.body;
var fromid=inputs.from_id;
var toid=inputs.to_id;
var deviceId=inputs.deviceId;
var json={};
var json1={};
var device_token1='';
var u_name='';
var title1='';
var body1='';
if(fromid && toid)
{
    Note.find({
        "_id":  {
            "$in": [fromid, toid]
        }
    }).then(note=>{
       if(note.length==2)
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
                        res.status(500).send({
                          result:"failed",message:"There was an exception",errorMessage: err.message });
                    });
                    console.log("Test1");  
            }else{
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
                          result:"failed",message:"There was an exception",errorMessage: err.message});
                    });
                    console.log("Test1");  
            }

            //create friend request
            Relative.find({
                "user_id":  {
                    "$in": [fromid, toid]
                }
            }).then(request=>{
                console.log("Test2");                
                if(request.length==2)
                {
                    if(request[0].user_id==fromid)
                    {
                        //for devicetoken and username
                        device_token1=note[1].device_token;
                        console.log("device_token1 :",device_token1);
                        u_name=note[0].first_name+" "+note[0].last_name;
                        console.log("u_name :",u_name);
                        title1='SINDHBOOK';
                        body1='You have a new Relative request from '+u_name;

                        // code to insert requested list to accepted list
                        var request_list_array=[];
                        var accepted_list=[];
                        request_list_array=(request[0].r_requested_list);
                        accepted_list=(request[0].r_accepted_list);
                        for(var i=0; i<request_list_array.length;i++)
                        {
                            console.log("Test44");
                            if(request_list_array[i].id==toid)
                            {
                                json={};
                                json["id"]=request_list_array[i].id;
                                json["user_name"]=request_list_array[i].user_name;
                                json["profile_pic"]=request_list_array[i].profile_pic;
                                json["from_relation"]=request_list_array[i].from_relation;
                                json["to_relation"]=request_list_array[i].to_relation;
                                json["date"]=new Date();
                                json["deviceId"]=deviceId;
                                accepted_list.push(json);
                                
                                request_list_array.splice(i, 1);

                                const updatedevice=Relative.updateOne( 
                                    {user_id: fromid}, 
                                    {
                                    r_accepted_list:accepted_list,
                                    r_requested_list:request_list_array
                                    },function(err,updatedevice) {
                                    if (err){ return res.status(500).send({result:"failed",message:"There was a problem adding the information to the database."});
                                    }                         
                                    })
                                    .catch(err => {
                                        res.status(500).send({
                                        result:"failed",message:"There was an exception",errorMessage: err.message});
                                    });
                            }
                        }
                        // code to insert requested by me to accepted list
                        var requested_by_me=[];
                        var accepted_list1=[];
                        requested_by_me=(request[1].r_requested_by_me);
                        accepted_list1=(request[1].r_accepted_list);
                        for(var i=0; i<requested_by_me.length;i++)
                        {
                            console.log("Test44");
                            if(requested_by_me[i].id==fromid)
                            {
                                console.log("array------",requested_by_me[i])
                                json1={};
                                json1["id"]=requested_by_me[i].id;
                                json1["user_name"]=requested_by_me[i].user_name;
                                json1["profile_pic"]=requested_by_me[i].profile_pic;
                                json1["from_relation"]=requested_by_me[i].from_relation;
                                json1["to_relation"]=requested_by_me[i].to_relation;
                                json1["date"]=new Date();
                                json1["deviceId"]=deviceId;
                                accepted_list1.push(json1);

                                requested_by_me.splice(i, 1);

                                const updatedevice=Relative.updateOne( 
                                    {user_id: toid}, 
                                    {
                                    r_accepted_list:accepted_list1,
                                    r_requested_by_me:requested_by_me
                                    },function(err,updatedevice) {
                                    if (err){ return res.status(500).send({result:"failed",message:"There was a problem adding the information to the database."});
                                    }
                                    else
                                    {
                                        another.notify(device_token1, title1, body1);
                                        return res.status(200).send({result:"success",message:"Accepted relative request successfully"}); 
                                    }                         
                                    })
                                    .catch(err => {
                                        res.status(500).send({
                                        result:"failed",message:"There was an exception",errorMessage: err.message});
                                    });
                            }
                        }
                    }
                    else if(request[1].user_id==fromid )
                    {
                        //for devicetoken
                        device_token1=note[0].device_token;
                        console.log("device_token1",devicetoken1);
                        u_name=note[1].first_name+" "+note[1].last_name;
                        console.log("u_name :",u_name);
                        title1='SINDHBOOK';
                        body1='You have a new Relative request from '+u_name;

                        // code to insert requested list to accepted list
                        var request_list_array=[];
                        var accepted_list=[];
                        request_list_array=(request[1].r_requested_list);
                        accepted_list=(request[1].r_accepted_list);
                        for(var i=0; i<request_list_array.length;i++)
                        {
                            console.log("Test44");
                            if(request_list_array[i].id==toid)
                            {
                                json={};
                                json["id"]=request_list_array[i].id;
                                json["user_name"]=request_list_array[i].user_name;
                                json["profile_pic"]=request_list_array[i].profile_pic;
                                json["from_relation"]=request_list_array[i].from_relation;
                                json["to_relation"]=request_list_array[i].to_relation;
                                json["date"]=new Date();
                                json["deviceId"]=deviceId;
                                accepted_list.push(json);
                                
                                request_list_array.splice(i, 1);
                                const updatedevice=Relative.updateOne( 
                                    {user_id: fromid}, 
                                    {
                                        r_accepted_list:accepted_list,
                                        r_requested_list:request_list_array
                                    },function(err,updatedevice) {
                                    if (err){ return res.status(500).send({result:"failed",message:"There was a problem adding the information to the database."});
                                    }                         
                                    })
                                    .catch(err => {
                                        res.status(500).send({
                                        result:"failed",message:"There was an exception",errorMessage: err.message});
                                    });
                            }
                        }
                        // code to insert requested by me to accepted list
                        var requested_by_me=[];
                        var accepted_list1=[];
                        requested_by_me=(request[0].r_requested_by_me);
                        accepted_list1=(request[0].r_accepted_list);
                        for(var i=0; i<requested_by_me.length;i++)
                        {
                            console.log("Test44");
                            if(requested_by_me[i].id==fromid)
                            {
                                json1={};
                                json1["id"]=requested_by_me[i].id;
                                json1["user_name"]=requested_by_me[i].user_name;
                                json1["profile_pic"]=requested_by_me[i].profile_pic;
                                json1["from_relation"]=requested_by_me[i].from_relation;
                                json1["to_relation"]=requested_by_me[i].to_relation;
                                json1["date"]=new Date();
                                json1["deviceId"]=deviceId;
                                accepted_list1.push(json1);

                                requested_by_me.splice(i, 1);
                                const updatedevice=Relative.updateOne( 
                                    {user_id: toid},
                                    {
                                        r_accepted_list:accepted_list1,
                                        r_requested_by_me:requested_by_me
                                    },function(err,updatedevice) {
                                    if (err){ return res.status(500).send({result:"failed",message:"There was a problem adding the information to the database."});
                                    }
                                    else
                                    {
                                        another.notify(device_token1, title1, body1);
                                        return res.status(200).send({result:"success",message:"Accepted relative request successfully"}); 
                                    }                          
                                    }).catch(err => {
                                        res.status(500).send({
                                        result:"failed",message:"There was an exception",errorMessage: err.message });
                                    });
                            }
                        }
                    }
                }
                else{
                    res.status(200).send({result:"success",message:"from_id or to_id does not exist in friend table"})
                }
            })
            .catch(err => {
                res.status(500).send({
                  result:"failed",message:"There was an exception",errorMessage: err.message});
            });
        }
        else{
            res.status(200).send({result:"success",message:"from_id or to_id does not exist in register table"})
        }
        }).catch(err => {
            res.status(500).send({
              result:"failed",message:"There was an exception",errorMessage: err.message});
        });
    }
}