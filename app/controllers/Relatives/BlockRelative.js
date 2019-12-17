const Note=require('../../models/note.model.js');
const Friend=require('../../models/Friends/friends.model1.js');
const Relative=require('../../models/Relative_models/relatives.model.js');

exports.BlockRelative1= (req, res) => {
console.log("start ......BlockRelative1");
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
                if(device_array.includes(deviceId)){
                    console.log("Token Found");
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
                json={};
                json["id"]=note[0].id;
                json["user_name"]=note[0].first_name+" "+note[0].last_name;
                json["profile_picture"]=note[0].profile_picture;
                json["date"]=new Date();
                json["deviceId"]=deviceId;

                json1={};
                json1["id"]=note[1].id;
                json1["user_name"]=note[1].first_name+" "+note[1].last_name;
                json1["profile_picture"]=note[1].profile_picture;
                json1["date"]=new Date();
                json1["deviceId"]=deviceId;
            }
            else
            {
                //update device token
                var device_array=[];
                device_array=(note[1].deviceId);            
                if(device_array.includes(deviceId)){
                    console.log("Token Found");
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

                json={};
                console.log("id_use=note[1].id=",note[1].id);
                json["id"]=note[1].id;
                json["user_name"]=note[1].first_name+" "+note[1].last_name;
                json["profile_picture"]=note[1].profile_picture;
                json["date"]=new Date();
                json["deviceId"]=deviceId;

                json1={};
                json1["id"]=note[0].id;
                json1["user_name"]=note[0].first_name+" "+note[0].last_name;
                json1["profile_picture"]=note[0].profile_picture;
                json1["date"]=new Date();
                json1["deviceId"]=deviceId;
            }
            var requested_lst=[];
            var accepted_lst=[];
            var requested_byme_lst=[];
            var blocked_lst=[];
            //block user 
            Relative.find({
                "user_id": fromid
            }).then(request=>{
                if(request.length!=0)
                {
                    var flag=0;
                    requested_lst=request[0].r_requested_list;
                    accepted_lst=request[0].r_accepted_list;
                    requested_byme_lst=request[0].r_requested_by_me;
                    blocked_lst=request[0].r_blocked_list;
                    for(var i=0;i<requested_lst.length;i++){
                        if(requested_lst[i].id==toid){
                                requested_lst.splice(i, 1);  
                                flag=1;                      
                        }
                    }
                    for(var i=0;i<accepted_lst.length;i++){
                        if(accepted_lst[i].id==toid){
                                accepted_lst.splice(i, 1);
                                flag=1;
                        }
                    }
                    for(var i=0;i<requested_byme_lst.length;i++){
                        if(requested_byme_lst[i].id==toid){
                            requested_byme_lst.splice(i, 1);
                            flag=1;
                        }
                    }
                    for(var i=0;i<blocked_lst.length;i++){
                        if(blocked_lst[i].id==toid){
                           return res.status(200).send({result:"success",message:"Already blocked"});
                        }
                        else
                        {
                            flag=1;
                        }
                    }
                    if(flag==1)
                    {
                        blocked_lst.push(json1);
                        const updatedevice=Relative.updateOne( 
                            {user_id: fromid}, 
                            {
                                accepted_list:accepted_lst,
                                requested_list:requested_lst,
                                requested_by_me:requested_byme_lst,
                                blocked_list:blocked_lst
                            },function(err,updatedevice) {
                            if(err)
                            { 
                                return res.status(500).send({result:"failed",message:"There was a problem adding the information to the database."});
                            }
                            else
                            {
                                insert_data();   
                            }                          
                            }).catch(err => {
                                res.status(500).send({result:"failed",message:"There was an exception",errorMessage: err.message});
                            });
                    }
                    else
                    {
                        blocked_lst.push(json1);
                        const updatedevice=Relative.updateOne( 
                            {user_id: fromid}, 
                            {
                                blocked_list:blocked_lst
                            },function(err,updatedevice) {
                            if(err)
                            { 
                                return res.status(500).send({result:"failed",message:"There was a problem adding the information to the database."});
                            }
                            else
                            {
                                insert_data();   
                            }                          
                            }).catch(err => {
                                res.status(500).send({result:"failed",message:"There was an exception",errorMessage: err.message});
                            });
                    }
                }
                else
                {
                    blocked_lst.push(json1);
                    const trans1=new Relative({
                        user_id : fromid,
                        r_blocked_list :blocked_lst,
                        privacy:3,
                    })
                    trans1.save()
                    .then(data=>{
                        insert_data();
                    }).catch(err => {
                        res.status(500).send({result:"failed",message:"There was an exception",errorMessage: err.message});
                    });
                }
            }).catch(err => {
                res.status(500).send({result:"failed",message:"There was an exception",errorMessage: err.message});
            });
            /***************************************************************************/
            function insert_data()
            {
                var requested_lst=[];
                var accepted_lst=[];
                var requested_byme_lst=[];
                var blocked_lst=[];
                var blocked_otheruser=[];
                Relative.find({
                    "user_id": toid
                }).then(request=>{
                    if(request.length!=0)
                    {
                        var flag=0;
                        requested_lst=request[0].r_requested_list;
                        accepted_lst=request[0].r_accepted_list;
                        requested_byme_lst=request[0].r_requested_by_me;
                        blocked_lst=request[0].r_blocked_list;
                        blocked_otheruser=request[0].r_blocked_by_others;
                        for(var i=0;i<blocked_otheruser.length;i++){
                            if(blocked_otheruser[i].id==fromid){
                                return res.status(200).send({result:"success",message:"Already blocked"});
                             }
                             else
                             {
                                 flag=1;
                             }
                        }
                        for(var i=0;i<requested_lst.length;i++){
                            if(requested_lst[i].id==fromid){
                                    requested_lst.splice(i, 1);  
                                    flag=1;                      
                            }
                        }
                        for(var i=0;i<accepted_lst.length;i++){
                            if(accepted_lst[i].id==fromid){
                                    accepted_lst.splice(i, 1);
                                    flag=1;
                            }
                        }
                        for(var i=0;i<requested_byme_lst.length;i++){
                            if(requested_byme_lst[i].id==fromid){
                                requested_byme_lst.splice(i, 1);
                                flag=1;
                            }
                        }
                        if(flag==1)
                        {
                            blocked_otheruser.push(json);  
                            const updatedevice=Relative.updateOne( 
                                {user_id: toid}, 
                                {
                                    r_accepted_list:accepted_lst,
                                    r_requested_list:requested_lst,
                                    r_requested_by_me:requested_byme_lst,
                                    r_blocked_by_others:blocked_otheruser
                                },function(err,updatedevice) {
                                if(err)
                                { 
                                    return res.status(500).send({result:"failed",message:"There was a problem adding the information to the database."});
                                }
                                else
                                {
                                    return res.status(200).send({result:"success",message:"Blocked Relative successfully"});   
                                }                          
                                }).catch(err => {
                                    res.status(500).send({result:"failed",message:"There was an exception",errorMessage: err.message});
                                });
                        }
                        else
                        {
                            blocked_otheruser.push(json);  
                            const updatedevice=Relative.updateOne( 
                                {user_id: toid}, 
                                {
                                    r_blocked_by_others:blocked_otheruser
                                },function(err,updatedevice) {
                                if(err)
                                { 
                                    return res.status(500).send({result:"failed",message:"There was a problem adding the information to the database."});
                                }
                                else
                                {
                                    return res.status(200).send({result:"success",message:"Blocked Relative successfully"});  
                                }                          
                                }).catch(err => {
                                    res.status(500).send({result:"failed",message:"There was an exception",errorMessage: err.message});
                                });
                        }
                    }
                    else
                    {
                        blocked_otheruser.push(json);
                        const trans1=new Relative({
                            user_id : toid,
                            r_blocked_by_others :blocked_otheruser,
                            privacy:3,
                        })
                        trans1.save()
                        .then(data=>{
                            return res.status(200).send({result:"success",message:"Blocked Relative successfully"}); 
                        }).catch(err => {
                            res.status(500).send({result:"failed",message:"There was an exception",errorMessage: err.message});
                        });
                    }
                }).catch(err => {
                    res.status(500).send({result:"failed",message:"There was an exception",errorMessage: err.message});
                });
            }
       }
    }).catch(err => {
        res.status(500).send({result:"failed",message:"There was an exception",errorMessage: err.message});
    });
}
}