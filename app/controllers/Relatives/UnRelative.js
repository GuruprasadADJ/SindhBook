const Note=require('../../models/note.model.js');
const Relative=require('../../models/Relative_models/relatives.model.js');

exports.UnRelative= (req, res) => {
console.log("start......");
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

            //unrelative from the acepted ist in from user
           function one(){
            Relative.find({
                "user_id": fromid
            }).then(request=>{
                
                var accepted_list=[];
                accepted_list=request[0].r_accepted_list;
                for(var i=0; i<accepted_list.length;i++)
                {
                    if(accepted_list[i].id==toid){
                        accepted_list.splice(i, 1);
                    }
                }
                const unrelativeone=Relative.updateOne(
                    {user_id: fromid}, 
                    {
                        r_accepted_list:accepted_list
                    },function(err,unrelativeone) {
                       if (err){ return res.status(500).send({result:"failed",message:"There was a problem adding the information to the database."});
                       }
                       else{
                            res.status(200).send({result:"success",message:"Unrelative successful"})
                       }    
                    }).catch(err => {
                        res.status(500).send({result:"failed",message:"There was an exception",errorMessage: err.message});
                    });
            }).catch(err => {
                res.status(500).send({result:"failed",message:"There was an exception",errorMessage: err.message});
            });
        }
            //unrelative from the acepted list in to user
            Relative.find({
                "user_id": toid
            }).then(request1=>{
                
                var accepted_list=[];
                accepted_list=request1[0].r_accepted_list;
                for(var i=0; i<accepted_list.length;i++)
                {
                    if(accepted_list[i].id==fromid){
                        accepted_list.splice(i, 1);
                    }
                }
                const unrelativetwo=Relative.updateOne(
                    {user_id: toid}, 
                    {
                        r_accepted_list:accepted_list
                    },function(err,unrelativetwo) {
                       if (err){ return res.status(500).send({result:"failed",message:"There was a problem adding the information to the database."});
                       }
                       else{
                            one();
                       }    
                    }).catch(err => {
                        res.status(500).send({result:"failed",message:"There was an exception",errorMessage: err.message});
                    });
            }).catch(err => {
                res.status(500).send({result:"failed",message:"There was an exception",errorMessage: err.message});
            });
       }
       else
       {
          res.status(200).send({result:"success",message:"from id or toid is does not exist"})
       }
    }).catch(err => {
        res.status(500).send({result:"failed",message:"There was an exception1",errorMessage: err.message});
    });
}
}