const privacy = require('../models/privacy.model.js');
const Note = require('../models/note.model.js');

var flag=0;
exports.createprivacy = (req, res) => {         // PRIVACY API TO EDIT THE PRIVACY
   // var post=about=profile=0;
   console.log("inputs coming", req.body.id);
    var inputs=req.body;

    if(!inputs.id){
        console.log("not found input");
        return res.status(200).send({result:"success",message: "id is required "});
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
                return res.status(200).send({result:"success",message: "database data not found with this id"});            
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
                        if (err) return res.status(500).send({
                            result:"failed",message:"There Was A problem Inserting Data",errorMessage:err.message
                        });
                    })
                    privacy2.save() // this creates the database as privacy
                    .then(data => { 
                        console.log("created row in privacy",data);    
                        res.status(200).send({result:"success",message:"privacy created successfully",data:data});
                      }).catch(err => {
                        res.status(500).send({
                            result:"failed",message:"Not Registered",errorMessage: err.message || "Some error occurred while creating the Note."
                        });
                    });  
                 } 
                 else{
                     res.status(200).send({result:"failed",message:"something went wrong"});
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
                          if (err){return res.status(500).send({result:"failed",message:"There was a problem adding the information to the database."});}
                          else{
                            res.status(200).send({result:"success",message:"privacy updated successfully",data:privacy3});
                          }
                        }).catch(err => {
                            res.status(500).send({
                            result:"failed",message:"there was an error",errorMessage: err.message || "Some error occurred while creating the Note."
                            });
                        });
                    }
                }
            });
        }
        }).catch(err => {
            res.status(500).send({
                result:"failed",message:"Not Registered",errorMessage: err.message || "Some error occurred while creating the Note."
            });
        });  
    }       
}

//-----------------------------      API TO SHOW PRIVACY DETAILS       -----------------------------

exports.showprivacy1 = (req, res) => {        //PRIVACY API TO SHOW THE PRIVACY 
    var inputs=req.body;

    if(!inputs.id){
        console.log("not found input");
        return res.status(200).send({result:"success",message:"id is required "});
    }
    else
    {
    Note.find({          //checks wether the user_id exist in privacy table
        "id": inputs.id 
    }).then(note=>{
        if(!note.length==0){
            res.status(200).send({result:"success",message:"user not found with this id in rgisters"});
        }
        else{
            privacy.find({          //checks wether the user_id exist in privacy table
                "user_id": inputs.id
            }).then(result=>{
                if(result.length==0){
                        const privacy4 = new privacy({
                        user_id: inputs.id,
                        post: 1,
                        about:1,
                        profile:1
                        },function(err,privacy4) {
                        if (err) return res.status(500).send({
                            result:"failed",message:"There Was A problem Inserting Data",errorMessage:err.message
                        });
                    })
                    privacy4.save() // this creates the database as privacy
                    .then(data4=> { 
                        res.status(500).send({result:"success",message:"data found",data:data4});
                      }).catch(err => {
                        res.status(500).send({
                            result:"failed",message:"Not Registered",errorMessage: err.message || "Some error occurred while creating the Note."
                        });
                    }); 

                    //res.status(200).send({result:"failed",message:"user not found with this user_id in privacy table"});
                }else{
                    res.status(200).send({result:"success",message:"data found",data:result[0]});
                }
            }).catch(err => {
                res.status(500).send({
                    result:"failed",message:"Not Registered",errorMessage: err.message || "Some error occurred while creating the Note."
                });
            })
         
        }
    })
  }

   
}