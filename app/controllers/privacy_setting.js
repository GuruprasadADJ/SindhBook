const privacy = require('../models/privacy.model.js');
const Note = require('../models/note.model.js');

var flag=0;
exports.createprivacy = (req, res) => {         // PRIVACY API TO EDIT THE PRIVACY
// var post=about=profile=0;
console.log("inputs coming", req.body.id);
var inputs=req.body;
var deviceId=req.body.deviceId;

    if(!inputs.id){
        console.log("not found input");
        return res.status(200).send({result:"success",message: "Please enter id"});
    }
    else
    {
        console.log("got input");
        Note.findById(inputs.id)
        .then(note => {
            console.log("checked");
            if(!note) {
                return res.status(200).send({result:"success",message: "Data not in database with this id "+inputs.id});            
            }
            else
            {

             if(deviceId)
             {
                //update device token
                var device_array=[];
                device_array=(note.deviceId);            
                if(device_array.includes(deviceId)){
                    console.log("Token Found");
                }
                else if(device_array.length==0)
                {
                  device_array.push(deviceId);
                  console.log("Token Not Found");
                  const updatedevice=Note.updateOne( 
                    {_id: inputs.id}, 
                    {deviceId: device_array}
                    ,function(err,updatedevice) {
                        console.log("Test");
                    if (err){ return res.status(500).send({result:"failed",message:"There was a problem adding the information"});
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
                        {_id: inputs.id}, 
                        {$set: { deviceId: device_array}}
                        ,function(err,updatedevice) {
                            console.log("Test");
                        if (err){ return res.status(500).send({result:"failed",message:"There was a problem adding the information"});
                        }                           
                        }).catch(err => {
                            res.status(500).send({result:"failed",message:"There was an exception",errorMessage: err.message});
                        });
                        console.log("Test1");  
                    }
            }


              privacy.find({          //checks wether the user_id exist in privacy table
                  "user_id": inputs.id
              }).then(privacy1 => {

                if(privacy1.length!=0)
                {  
                    //if record already exist in privacy table
                    var post=privacy1[0].post;
                    var about=privacy1[0].about;
                    var profile=privacy1[0].profile;
                    if(inputs.post||inputs.about||inputs.profile)
                    {
                        const privacy3=privacy.updateMany(      //updates records in record
                       {user_id:inputs.id},
                       {post:inputs.post || post,
                        about:inputs.about||about,
                        profile:inputs.profile||profile,
                        deviceId:deviceId},
                         function(err,privacy3) {
                           
                          if (err){return res.status(500).send({result:"failed",message:"There was a problem adding the information to the database."});}
                          else{
                            var responsedata='';
                              privacy.find({"user_id": inputs.id
                              }).then(privacY => {
                                responsedata=privacY[0];
                                res.status(200).send({result:"success",message:"Data updated successfully",data:responsedata});
                              });
                          }
                        }).catch(err => {
                            res.status(500).send({result:"failed",message:"There was an exception",errorMessage: err.message});
                        });
                    }
                }
                else
                {   
                     //if user_id doesn't exist in privay table creates record 
                     if(inputs.post||inputs.about||inputs.profile)
                     {
                        const privacy2 = new privacy({
                          user_id: inputs.id,
                          post: inputs.post  ||3,
                          about:inputs.about||3,
                          profile:inputs.profile||3,
                          deviceId:deviceId
                            },function(err,note) {
                            if (err) return res.status(500).send({result:"failed",message:"There was a problem adding the information to the database."});
                        })
                        privacy2.save() // this creates the database as privacy
                        .then(data => { 
                            console.log("created row in privacy",data);    
                            res.status(200).send({result:"success",message:"Data inserted successfully",data:data});
                        }).catch(err => {
                            res.status(500).send({result:"failed",message:"There was an exception",errorMessage: err.message});
                        });  
                  }      
                }
                
            }).catch(err => {
                res.status(500).send({result:"failed",message:"There was an exception",errorMessage: err.message});
            });
        }
        }).catch(err => {
            res.status(500).send({result:"failed",message:"There was an exception",errorMessage: err.message});
        });  
    }       
}

//-----------------------------      API TO SHOW PRIVACY DETAILS       -----------------------------

exports.showPrivacyDetails = (req, res) => { 
    console.log(req.params.privacyId);
    Note.findById(req.params.privacyId)
    .then(note=>{
        if(!note){
            return res.status(200).send({result:'failed',message: "Data not found in database with this id "+req.params.privacyId});
        }
        else{
            var inputs=req.params.privacyId;
            privacy.find({          //checks wether the user_id exist in privacy table
                "user_id": inputs
            }).then(result=>{
                if(result.length==0){
                    var json={};
                    json["post"]=3;
                    json["about"]=3;
                    json["profile"]=3;
               
                    res.status(200).send({result:"success",message:"Showing privacy details",data:json});
                }else{
                    res.status(200).send({result:"success",message:"Showing privacy details",data:result[0]});
                }
            }).catch(err => {
                res.status(500).send({result:"failed",message:"There was an exception",errorMessage: err.message});
            });      
        }
    }).catch(err => {
        res.status(500).send({result:"failed",message:"There was an exception",errorMessage: err.message});
    });
}