const Note=require('../models/note.model.js');
const Friend=require('../models/friends.model');
const frnd_trs=require('../models/friends_transaction.js');
const moment = require('moment'); //to parse the default date of mongodb

//four api's exist in this file
// app.post('/sendFriendRequest',Friends.sendFriendRequest); 
// app.post('/removeFriendFromList',Friends.removeFriendFromList);
// app.post('/acceptFriendRequest',Friends.acceptFriendRequest);
// app.post('/rejectFriendRequest',Friends.rejectFriendRequest);

//==================================      sendFriendRequest       ===============================
//
exports.sendFriendRequest = (req, res) => {    
    var title='';
    var body='';
var inputs=req.body;
var fromid=inputs.from_id;
var toid=inputs.to_id;
var inputstatus=req.body.status;
if(fromid && toid)
{
    Note.find({
        "_id":  {
            "$in": [fromid, toid]
        }
    }).then(note=>{
       if(!note.length==0)
       {
           var device_token=note[1].device_token;
           var firstname=note[0].first_name||'';
           var lastname=note[0].last_name||'';
            console.log(device_token)
            Friend.find({
                "from_id": fromid,
                "to_id": toid
            }).then(friend1=>{
                if(!friend1.length==0){
                    var status=friend1[0].status;
                    if(status==1){
                        res.status(200).send({result:"success",message:'Friend request was already sent',data:{status:status,to_id:friend1[0].to_id}});
                    }
                    else if(status==2){
                        res.status(200).send({result:"success",message:'Already friends',data:{status:status,to_id:friend1[0].to_id}});
                    }
                    else if(status==4){
                        res.status(200).send({result:"success",message:'Blocked by the other user',data:{status:status,blocked_by:friend1[0].to_id}});
                    }
                    else{
                        const frndcreate=Friend.updateOne( //updates records in created record
                            {_id: friend1[0]._id}, 
                            {status : inputstatus
                            },function(err,frndcreate) {
                               if (err){ return res.status(500).send({result:"failed",message:"There was a problem adding the information to the database."});
                               }
                               else{
                                const trans=new frnd_trs({
                                    from_id : fromid,
                                    to_id : toid,
                                    status :inputstatus,  //1: pending, 2: accepted, 3: rejected, 4: blocked
                                    date :new Date()
                                })
                                trans.save();
                                if(inputstatus==1){
                                    res.status(200).send({result:"success",message:"Friend request sent again successfully",data:frndcreate});
                                }else if(inputstatus==5){
                                    res.status(200).send({result:"success",message:"User removed successfully",data:frndcreate});
                                }
                                   
                               }                             
                             }).catch(err => {
                                   res.status(500).send({
                                     result:"failed",message:"There was an exception",errorMessage: err.message || "Some error occurred while creating the Note."
                            });
                          });
                    }
                }
                else {
                    Friend.find({
                        "from_id": toid,
                        "to_id": fromid
                    }).then(friend2=>{
                        if(!friend2.length==0){
                            var status=friend2[0].status;
                            if(status==1){
                                res.status(200).send({result:"success",message:'Friend request already sent',data:{status:status,to_id:friend2[0].from_id}});
                            }
                            else if(status==2){
                                res.status(200).send({result:"success",message:'Already friends',data:{status:status,to_id:friend2[0].from_id}});
                            }
                            else if(status==4){
                                res.status(200).send({result:"success",message:'Blocked by the other user',data:{status:status,blocked_by:friend2[0].from_id}});
                            }
                            else{
                                const frndcreate=Friend.update( //updates records in created record
                                    {_id: friend2[0]._id},           
                                    {
                                    status : inputstatus,
                                    from_id: toid,
                                    to_id: fromid
                                    },function(err,frndcreate) {
                                       if (err){ return res.status(500).send({result:"failed",message:"There was a problem adding the information to the database."});
                                       }
                                       else{
                                        const trans=new frnd_trs({
                                            from_id : fromid,
                                            to_id : toid,
                                            status :inputstatus,  //1: pending, 2: accepted, 3: rejected, 4: blocked
                                            date :new Date()
                                        })
                                        trans.save();
                                            title='sindhbook';
                                            body='friend request send by'+firstname+''+lastname;
                                           notify(device_token,title,body);
                                           if(inputstatus==1){
                                            res.status(200).send({result:"success",message:"Friend request sent again successfully",data:frndcreate});
                                           }else if(inputstatus==5){
                                            res.status(200).send({result:"success",message:"User removed successfully",data:frndcreate});
                                           }
                                           
                                       }                             
                                     }).catch(err => {
                                           res.status(500).send({
                                             result:"failed",message:"There was an exception",errorMessage: err.message || "Some error occurred while creating the Note."
                                    });
                                  });
                            }
                        }
                        else{
                           const friend=new Friend({
                                from_id : fromid,
                                to_id : toid,
                                status : inputstatus,  //1: pending, 2: accepted, 3: rejected, 4: blocked
                                date :new Date()
                            },function(err,friends) {
                            if (err) return res.status(500).send({
                                result:"failed",message:"There was a problem inserting data into database",errorMessage:err.message
                            });
                            })
                            friend.save() // this creates the database as privacy
                            .then(data => {
                                const trans=new frnd_trs({
                                    from_id : fromid,
                                    to_id : toid,
                                    status :inputstatus,  //1: pending, 2: accepted, 3: rejected, 4: blocked
                                    date :new Date()
                                })
                                trans.save();
                                     title='sindhbook';
                                     body='friend request send by'+firstname+''+lastname;
                                    notify(device_token,title,body);
                                    if(inputstatus==1){
                                        res.status(200).send({result:'success',message:'Friend request sent successfully',data:data})
                                    }else{
                                        res.status(200).send({result:'success',message:'User removed successfully',data:data})
                                    }
                                    
                            }).catch(err => {
                                res.status(500).send({
                                result:"failed",message:"There was an exceptionNot Registered",errorMessage: err.message || "Some error occurred while creating the Note."
                            });
                            })
                        }
                    })
                } 
            }) 

        }else{
            res.status(200).send({result:'failed',message:'data not found in register table'})
        }
    }).catch(err => {
        res.status(500).send({
        result:"failed",message:"Not Registered",errorMessage: err.message || "Some error occurred while creating the Note."
    });
    })
}else{
    res.status(200).send({result:'success',message:'from id and to id are mandatory'});
}   
}



//=================================     removeFriendFromList     =================================
//

exports.removeFriendFromList = (req, res) => {    
    var title='';
    var body='';
var inputs=req.body;
var fromid=inputs.from_id;
var toid=inputs.to_id;
var inputstatus=req.body.status;
if(fromid && toid)
{
    Note.find({
        "_id":  {
            "$in": [fromid, toid]
        }
    }).then(note=>{
       if(!note.length==0)
       {
           var device_token=note[1].device_token;
           var firstname=note[0].first_name||'';
           var lastname=note[0].last_name||'';
            console.log(device_token)
            Friend.find({
                "from_id": fromid,
                "to_id": toid
            }).then(friend1=>{
                if(!friend1.length==0){
                    var status=friend1[0].status;
                    if(status==1){
                        res.status(200).send({result:"success",message:'Friend request was already sent',data:{status:status,to_id:friend1[0].to_id}});
                    }
                    else if(status==2){
                        res.status(200).send({result:"success",message:'Already friends',data:{status:status,to_id:friend1[0].to_id}});
                    }
                    else if(status==4){
                        res.status(200).send({result:"success",message:'Blocked by the other user',data:{status:status,blocked_by:friend1[0].to_id}});
                    }
                    else{
                        const frndcreate=Friend.updateOne( //updates records in created record
                            {_id: friend1[0]._id}, 
                            {status : inputstatus
                            },function(err,frndcreate) {
                               if (err){ return res.status(500).send({result:"failed",message:"There was a problem adding the information to the database."});
                               }
                               else{
                                const trans=new frnd_trs({
                                    from_id : fromid,
                                    to_id : toid,
                                    status :inputstatus,  //1: pending, 2: accepted, 3: rejected, 4: blocked
                                    date :new Date()
                                })
                                trans.save();
                                if(inputstatus==1){
                                    res.status(200).send({result:"success",message:"Friend request sent again successfully",data:frndcreate});
                                }else if(inputstatus==5){
                                    res.status(200).send({result:"success",message:"User removed successfully",data:frndcreate});
                                }
                                   
                               }                             
                             }).catch(err => {
                                   res.status(500).send({
                                     result:"failed",message:"There was an exception",errorMessage: err.message || "Some error occurred while creating the Note."
                            });
                          });
                    }
                }
                else {
                    Friend.find({
                        "from_id": toid,
                        "to_id": fromid
                    }).then(friend2=>{
                        if(!friend2.length==0){
                            var status=friend2[0].status;
                            if(status==1){
                                res.status(200).send({result:"success",message:'Friend request already sent',data:{status:status,to_id:friend2[0].from_id}});
                            }
                            else if(status==2){
                                res.status(200).send({result:"success",message:'Already friends',data:{status:status,to_id:friend2[0].from_id}});
                            }
                            else if(status==4){
                                res.status(200).send({result:"success",message:'Blocked by the other user',data:{status:status,blocked_by:friend2[0].from_id}});
                            }
                            else{
                                const frndcreate=Friend.update( //updates records in created record
                                    {_id: friend2[0]._id},           
                                    {
                                    status : inputstatus,
                                    from_id: toid,
                                    to_id: fromid
                                    },function(err,frndcreate) {
                                       if (err){ return res.status(500).send({result:"failed",message:"There was a problem adding the information to the database."});
                                       }
                                       else{
                                        const trans=new frnd_trs({
                                            from_id : fromid,
                                            to_id : toid,
                                            status :inputstatus,  //1: pending, 2: accepted, 3: rejected, 4: blocked
                                            date :new Date()
                                        })
                                        trans.save();
                                            title='sindhbook';
                                            body='friend request send by'+firstname+''+lastname;
                                           notify(device_token,title,body);
                                           if(inputstatus==1){
                                            res.status(200).send({result:"success",message:"Friend request sent again successfully",data:frndcreate});
                                           }else if(inputstatus==5){
                                            res.status(200).send({result:"success",message:"User removed successfully",data:frndcreate});
                                           }
                                           
                                       }                             
                                     }).catch(err => {
                                           res.status(500).send({
                                             result:"failed",message:"There was an exception",errorMessage: err.message || "Some error occurred while creating the Note."
                                    });
                                  });
                            }
                        }
                        else{
                           const friend=new Friend({
                                from_id : fromid,
                                to_id : toid,
                                status : inputstatus,  //1: pending, 2: accepted, 3: rejected, 4: blocked
                                date :new Date()
                            },function(err,friends) {
                            if (err) return res.status(500).send({
                                result:"failed",message:"There was a problem inserting data into database",errorMessage:err.message
                            });
                            })
                            friend.save() // this creates the database as privacy
                            .then(data => {
                                const trans=new frnd_trs({
                                    from_id : fromid,
                                    to_id : toid,
                                    status :inputstatus,  //1: pending, 2: accepted, 3: rejected, 4: blocked
                                    date :new Date()
                                })
                                trans.save();
                                     title='sindhbook';
                                     body='friend request send by'+firstname+''+lastname;
                                    notify(device_token,title,body);
                                    if(inputstatus==1){
                                        res.status(200).send({result:'success',message:'Friend request sent successfully',data:data})
                                    }else{
                                        res.status(200).send({result:'success',message:'User removed successfully',data:data})
                                    }
                                    
                            }).catch(err => {
                                res.status(500).send({
                                result:"failed",message:"There was an exceptionNot Registered",errorMessage: err.message || "Some error occurred while creating the Note."
                            });
                            })
                        }
                    })
                } 
            })    

        }else{
            res.status(200).send({result:'failed',message:'data not found in register table'})
        }
    }).catch(err => {
        res.status(500).send({
        result:"failed",message:"Not Registered",errorMessage: err.message || "Some error occurred while creating the Note."
    });
    })
}else{
    res.status(200).send({result:'success',message:'from id and to id are mandatory'});
}   
}







//=================================      acceptFriendRequest     ==============================
//

exports.acceptFriendRequest = (req, res) => {
    var title='';
    var body='';
    var inputs=req.body;
    fromid=inputs.from_id;
    toid=inputs.to_id;
    var status=inputs.status;
    if(status==3 || status==2){
    }else{
        res.status(200).send({result:'failed',message:'status should be either 2 or 3',status:status});
    }
    if(fromid && toid && status)
    {
    Note.find({
        "_id":  {
            "$in": [fromid, toid]
        }
    }).then(note=>{
        if(!note.length==0)
        {  
             console.log(note[1].device_token)
            var device_token=note[1 ].device_token;
            var firstname1=note[0].first_name;
            var lastname1=note[0].last_name;
            console.log(device_token);
            Friend.find({
                "from_id": toid,
                "to_id": fromid
            }).then(friend3=>{
                if(!friend3.length==0)
                {
                    if(status==2)
                    {
                        const acceptrequest=Friend.updateOne( //updates records in created record
                            {_id: friend3[0]._id}, 
                            {status : status
                            },function(err,acceptrequest) {
                            if (err){ return res.status(500).send({result:"failed",message:"There was a problem adding the information to the database."});
                            }
                            else{
                                const trans=new frnd_trs({
                                    from_id : fromid,
                                    to_id : toid,
                                    status :status,  //1: pending, 2: accepted, 3: rejected, 4: blocked
                                    date :new Date()
                                })
                                trans.save();
                                 title='sindhbook';
                                 body='friend request rejected by'+firstname1+''+lastname1;
                                notify(device_token,title,body);
                                res.status(200).send({result:"success",message:"friend request accepted",data:acceptrequest});
                            }                             
                            }).catch(err => {
                                res.status(500).send({
                                    result:"failed",message:"there was an error",errorMessage: err.message || "Some error occurred while creating the Note."
                            });
                        });
                    }
                    else if(status==3){
                        Friend.remove({
                            "_id": friend3[0]._id
                        },
                        function(err,acceptrequest) {
                            if (err){ return res.status(500).send({result:"failed",message:"There was a problem adding the information to the database."});
                            }
                            else{
                                const trans=new frnd_trs({
                                    from_id : fromid,
                                    to_id : toid,
                                    status :status,  //1: pending, 2: accepted, 3: rejected, 4: blocked
                                    date :new Date()
                                })
                                trans.save();
                                 title='sindhbook';
                                 body='friend request accepted by'+''+firstname1+''+lastname1;
                                notify(device_token,title,body);
                                res.status(200).send({result:"success",message:"friend request rejeced",data:acceptrequest});
                            }                             
                            }).catch(err => {
                                res.status(500).send({
                                    result:"failed",message:"there was an error",errorMessage: err.message || "Some error occurred while creating the Note."
                            });
                        });
                    }
                    else{
                        res.staus(200).send({result:"failed",message:"something went wrong,please check the status"});
                    }
                    
                }else{
                    res.status(200).send({result:"failed",message:"wrong inputs"});
                }
            }).catch(err => {
            res.status(500).send({
            result:"failed",message:"Not Registered",errorMessage: err.message || "Some error occurred while creating the Note."
        });
        })
   }
   else{
       res.status(200).send({result:'failed',message:'fromid or toid is not exist in register table'});
   }
}).catch(err => {
    res.status(500).send({
    result:"failed",message:"Not Registered",errorMessage: err.message || "Some error occurred while creating the Note."
 });
 })
    }else{
        res.status(200).send({result:'success',message:'fromid, toid, and status keys are mandatory'});
    }
}


//====================================      rejectFriendRequest     =============================
//

exports.rejectFriendRequest = (req, res) => {
    var title='';
    var body='';
    var inputs=req.body;
    fromid=inputs.from_id;
    toid=inputs.to_id;
    var status=inputs.status;
    if(status==3 || status==2){
    }else{
        res.status(200).send({result:'failed',message:'status should be either 2 or 3',status:status});
    }
    if(fromid && toid && status)
    {
    Note.find({
        "_id":  {
            "$in": [fromid, toid]
        }
    }).then(note=>{
        if(!note.length==0)
        {  
             console.log(note[1].device_token)
            var device_token=note[1 ].device_token;
            var firstname1=note[0].first_name;
            var lastname1=note[0].last_name;
            console.log(device_token);
            Friend.find({
                "from_id": toid,
                "to_id": fromid
            }).then(friend3=>{
                if(!friend3.length==0)
                {
                    if(status==2)
                    {
                        const acceptrequest=Friend.updateOne( //updates records in created record
                            {_id: friend3[0]._id}, 
                            {status : status
                            },function(err,acceptrequest) {
                            if (err){ return res.status(500).send({result:"failed",message:"There was a problem adding the information to the database."});
                            }
                            else{
                                const trans=new frnd_trs({
                                    from_id : fromid,
                                    to_id : toid,
                                    status :status,  //1: pending, 2: accepted, 3: rejected, 4: blocked
                                    date :new Date()
                                })
                                trans.save();
                                 title='sindhbook';
                                 body='friend request rejected by'+firstname1+''+lastname1;
                                notify(device_token,title,body);
                                res.status(200).send({result:"success",message:"friend request accepted",data:acceptrequest});
                            }                             
                            }).catch(err => {
                                res.status(500).send({
                                    result:"failed",message:"there was an error",errorMessage: err.message || "Some error occurred while creating the Note."
                            });
                        });
                    }
                    else if(status==3){
                        Friend.remove({
                            "_id": friend3[0]._id
                        },
                        function(err,acceptrequest) {
                            if (err){ return res.status(500).send({result:"failed",message:"There was a problem adding the information to the database."});
                            }
                            else{
                                const trans=new frnd_trs({
                                    from_id : fromid,
                                    to_id : toid,
                                    status :status,  //1: pending, 2: accepted, 3: rejected, 4: blocked
                                    date :new Date()
                                })
                                trans.save();
                                 title='sindhbook';
                                 body='friend request accepted by'+''+firstname1+''+lastname1;
                                notify(device_token,title,body);
                                res.status(200).send({result:"success",message:"friend request rejeced",data:acceptrequest});
                            }                             
                            }).catch(err => {
                                res.status(500).send({
                                    result:"failed",message:"there was an error",errorMessage: err.message || "Some error occurred while creating the Note."
                            });
                        });
                    }
                    else{
                        res.staus(200).send({result:"failed",message:"something went wrong,please check the status"});
                    }
                    
                }else{
                    res.status(200).send({result:"failed",message:"wrong inputs"});
                }
            }).catch(err => {
            res.status(500).send({
            result:"failed",message:"Not Registered",errorMessage: err.message || "Some error occurred while creating the Note."
        });
        })
   }
   else{
       res.status(200).send({result:'failed',message:'fromid or toid is not exist in register table'});
   }
}).catch(err => {
    res.status(500).send({
    result:"failed",message:"Not Registered",errorMessage: err.message || "Some error occurred while creating the Note."
 });
 })
    }else{
        res.status(200).send({result:'success',message:'fromid, toid, and status keys are mandatory'});
    }
}





//---------------------------------------------------   FUNCTION FOR SENDING NOTIFICTION TO THE PHONE   ----------------------------------------
function notify(device_token1, title1, body1){
    var FCM = require('fcm-node');
    var serverKey = 'AAAAylA0pUE:APA91bG7ifK49cCTv0ORKIs1jvFZ56TUCBvo0o-cN6KmVkppObqb6gmkKzAIjM3Ts3Shs_3M96x0-77Ofxp-m4G6h34T7yfVUrQiTmb2ly5SLUUTXjHf_rmaFYIc5l1kIj8OwXQsOBdS'; //put your server key here
    var fcm = new FCM(serverKey);
        var message = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
    to: device_token1, 
    // collapse_key: 'your_collapse_key',
    
    // notification: {
    // title: 'Test Notification', 
    // message: 'Hello World' ,
    // order_id:'7485asdf'
    // }//, 
    data: { //you can send only notification or only data(or include both)
    // my_key: 'my value',
    // my_another_key: 'my another value'
    title: title1, 
    body: body1,
    }
    };
    fcm.send(message, function(err, response){
    if (err) {
    console.log("Something has gone wrong!"+err);
    } else {
    console.log("Successfully sent with response: ", response);
    }
    });
}
