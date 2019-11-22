const privacy = require('../models/privacy.model.js');
const Note = require('../models/note.model.js');

var flag=0;
exports.createprivacy = (req, res) => {         // PRIVACY API TO EDIT THE PRIVACY
   // var post=about=profile=0;
   console.log("inputs coming", req.body.id);
    var inputs=req.body;

    if(!inputs.id){
        console.log("not found input");
        return res.status(200).send({result:"Success",message: "Please enter id"});
    }
    else
    {
        console.log("got input");
        Note.find({             //checks  weather the user_id exist in register table
            "id": inputs.id
        })
        .then(note => {
            console.log("checked");
            if(!note) {
                return res.status(200).send({result:"Success",message: "Data not in database with this id "+inputs.id});            
            }
            else{
            privacy.find({          //checks wether the user_id exist in privacy table
                "user_id": inputs.id
            }).then(privacy1 => {
                if(privacy1.length==0) {   
                     //if user_id doesn't exist in privay table creates record 
                     if(inputs.post||inputs.about||inputs.profile)
                     {
                        const privacy2 = new privacy({
                        user_id: inputs.id,
                        post: inputs.post  ||1,
                        about:inputs.about||1,
                        profile:inputs.profile||1
                        },function(err,note) {
                        if (err) return res.status(500).send({result:"Failed",message:"There was a problem adding the information to the database."});
                    })
                    privacy2.save() // this creates the database as privacy
                    .then(data => { 
                        console.log("created row in privacy",data);    
                        res.status(200).send({result:"success",message:"Data inserted successfully",data:data});
                      }).catch(err => {
                        res.status(500).send({
                            result:"Failed",message:"There was an exception",errorMessage: err.message || "Some error occurred while creating the Note."
                        });
                    });  
                 } 
                 else{
                     res.status(200).send({result:"Failed",message:"No data found with this id "+inputs.id});
                 }         
                }
                else if(!privacy1.length==0) {  //if record already exist in privacy table
                    var post=privacy1[0].post;
                    var about=privacy1[0].about;
                    var profile=privacy1[0].profile;
                    if(inputs.post||inputs.about||inputs.profile)
                    {
                        const privacy3=privacy.updateMany(      //updates records in record
                       {user_id:inputs.id},
                       {post:inputs.post || post,
                        about:inputs.about||about,
                        profile:inputs.profile||profile},
                         function(err,privacy3) {
                           
                          if (err){return res.status(500).send({result:"Failed",message:"There was a problem adding the information to the database."});}
                          else{
                            var responsedata='';
                              privacy.find({"user_id": inputs.id
                              }).then(privacY => {
                                responsedata=privacY[0];
                                res.status(200).send({result:"Success",message:"Data updated successfully",data:responsedata});
                              });
                          }
                        }).catch(err => {
                            res.status(500).send({
                                result:"Failed",message:"There was an exception",errorMessage: err.message || "Some error occurred while creating the Note."
                            });
                        });
                    }
                }
            }).catch(err => {
                res.status(500).send({
                    result:"Failed",message:"There was an exception",errorMessage: err.message || "Some error occurred while creating the Note."
                });
            });
        }
        }).catch(err => {
            res.status(500).send({
                result:"Failed",message:"There was an exception",errorMessage: err.message || "Some error occurred while creating the Note."
            });
        });  
    }       
}

//-----------------------------      API TO SHOW PRIVACY DETAILS       -----------------------------

exports.showPrivacyDetails = (req, res) => { 
    console.log(req.params.privacyId);
    Note.findById(req.params.privacyId)
    .then(note=>{
        if(!note){
            return res.status(200).send({result:'Failed',
            message: "Data not found in database with this id" + req.params.privacyId
         });
        }
        else{
            var inputs=req.params.privacyId;
            privacy.find({          //checks wether the user_id exist in privacy table
                "user_id": inputs
            }).then(result=>{
                if(result.length==0){
                    var json={};
                    json["post"]=1;
                    json["about"]=1;
                    json["profile"]=1;
               
                    res.status(200).send({result:"Success",message:"Showing privacy details",data:json});
                }else{
                    res.status(200).send({result:"Success",message:"Showing privacy details",data:result[0]});
                }
            }).catch(err => {
                res.status(500).send({
                    result:"Failed",message:"There was an exception",errorMessage: err.message || "Some error occurred while creating the Note."
                });
            });      
        }
    }).catch(err => {
        res.status(500).send({
            result:"Failed",message:"There was an exception",errorMessage: err.message || "Some error occurred while creating the Note."
        });
    });
}