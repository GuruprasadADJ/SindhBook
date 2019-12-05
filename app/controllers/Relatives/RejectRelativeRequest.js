const Note=require('../../models/note.model.js');
const Relative=require('../../models/Relative_models/relatives.model.js');
const moment = require('moment'); //to parse the default date of mongodb

exports.RejectRelativeRequest = (req, res) => {    
    console.log("start......RejectRelativeRequest");
var inputs=req.body;
var fromid=inputs.from_id;
var toid=inputs.to_id;
var deviceId=inputs.deviceId;
if(fromid && toid)
{
    Note.find({
        "_id":  {
            "$in": [fromid, toid]
        }
    }).then(note=>{
        console.log("note  : ",note);
       if(note.length==2)
       {
           console.log("in to note");
           
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
                            res.status(500).send({result:"failed",message:"There was an exception",errorMessage: err.message});
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
                            res.status(500).send({result:"failed",message:"There was an exception",errorMessage: err.message});
                        });
                        console.log("Test1");  
                }
            }


           //delete from requested by me
           Relative.find({
                "user_id": fromid
            }).then(request=>{

                    var requested_list=[];
                    requested_list=request[0].r_requested_list;
                    for(var i=0; i<requested_list.length;i++)
                    {
                        if(requested_list[i].id==toid){
                            requested_list.splice(i, 1);
                        }
                    }
                    const removerequests=Relative.updateOne(
                        {user_id: fromid}, 
                        {
                         r_requested_list:requested_list
                        },function(err,removerequests) {
                           if (err){ return res.status(500).send({result:"failed",message:"There was a problem adding the information to the database."});
                           }                     
                        }).catch(err => {
                            res.status(500).send({result:"failed",message:"There was an exception",errorMessage: err.message});
                        });
            }).catch(err => {
                res.status(500).send({result:"failed",message:"There was an exception",errorMessage: err.message});
            });
        
       
            //delete from requested list
            Relative.find({
                "user_id": toid
            }).then(request1=>{
                
                var requested_by_me=[];
                requested_by_me=request1[0].r_requested_by_me;
                for(var i=0; i<requested_by_me.length;i++)
                {
                    if(requested_by_me[i].id==fromid){
                        requested_by_me.splice(i, 1);
                    }
                }
                const removerequests1=Relative.updateOne(
                    {user_id: toid}, 
                    {
                        r_requested_by_me:requested_by_me
                    },function(err,removerequests1) {
                       if (err){ return res.status(500).send({result:"failed",message:"There was a problem adding the information to the database."});
                       }
                       else{
                            res.status(200).send({result:"success",message:"Relative request rejected successfuly"})
                       }    
                    }).catch(err => {
                        res.status(500).send({result:"failed",message:"There was an exception3",errorMessage: err.message });
                    });

            }).catch(err => {
                res.status(500).send({ result:"failed",message:"There was an exception4",errorMessage: err.message });
            });
       }
       else
       {
          res.status(200).send({result:"success",message:"from id or toid is does not exist"})
       }
    })
}
}