const Aboutus = require('../models/aboutus.model.js');
const Note = require('../models/note.model.js');

var flag=0;
exports.createabout = (req, res) => {         // Aboutus API TO EDIT THE Aboutus
   // var post=about=profile=0;
   console.log("inputs coming", req.body.id);
    var inputs=req.body;

    if(!inputs.id){
        console.log("not found input");
        return res.status(200).send({message: "id is required "});
    }
    else
    {
        console.log("got input");
        Note.find({             //checks  weather the user_id exist in register table
            "_id": inputs.id
        })
        .then(note => {
            console.log("checked");
            if(!note) {
                return res.status(200).send({message: "database data not found with this id"});            
            }else{
            console.log("data found");
            Aboutus.find({          //checks wether the user_id exist in privacy table
                "user_id": inputs.id
            }).then(about1 => {
                if(about1.length==0) 
                {     
                    if(inputs.work||inputs.education||inputs.places_lived||note[0].mobile_no)
                    {                                //if user_id doesn't exist in privay table creates record 
                        var work1=[];
                        var education1=[];
                        var places_lived1=[]
                            if(inputs.work)
                             {
                                 work1.push(inputs.work);
                             }
                             if(inputs.education)
                             {
                                 education1.push(inputs.education);
                             }
                             if(inputs.places_lived)
                             {
                                 places_lived1.push(inputs.places_lived);
                             }
                        const about2 = new Aboutus({
                         user_id: inputs.id,
                         work:work1,
                         education:education1,
                         places_lived:places_lived1,
                         contact_info : note[0].mobile_no||''
                        },function(err,about2) {
                        if (err) return res.status(500).send({
                            result:"failed",message:"There Was A problem Inserting Data",errorMessage:err.message
                        });
                    })
                    about2.save() // this creates the database as privacy
                    .then(data => { 
                        res.status(200).send({result:"success",message:"about table ceated successfully",data:data});
                    }).catch(err => {
                        res.status(500).send({
                            result:"failed",message:"Not Registered",errorMessage: err.message || "Some error occurred while creating the Note."
                        });
                    });

                 }else{
                    res.status(200).send({result:"failed",message:"something is wrong"});
                 }
                }
                else if(!about1.length==0) {  //if record already exist in privacy table
                    console.log("ok");
               
                var work1=[];
                var education1=[];
                var places_lived1=[];
                work1=about1[0].work;
                education1=about1[0].education;
                places_lived1=about1[0].places_lived;
                ph_no=note[0].mobile_no;
                  if(inputs.work||inputs.education||inputs.places_lived||note[0].mobile_no)
                  {
                             if(inputs.work)
                             {
                                 work1.push(inputs.work);
                             }
                             if(inputs.education)
                             {
                                 education1.push(inputs.education);
                             }
                             if(inputs.places_lived)
                             {
                                 places_lived1.push(inputs.places_lived);
                             }
                      const about3=Aboutus.updateMany( //updates records in created record
                         {user_id:inputs.id}, 
                         {work:work1,
                         education:education1,
                         places_lived:places_lived1,
                         contact_info : note[0].mobile_no||''
                        },function(err,about3) {
                            if (err){ return res.status(500).send({result:"failed",message:"There was a problem adding the information to the database."});
                            }else{
                                res.status(200).send({result:"success",message:"about updated successfully",data:about1[0]});
                            }                             
                          }).catch(err => {
                                res.status(500).send({
                                  result:"failed",message:"there was an error",errorMessage: err.message || "Some error occurred while creating the Note."
                         });
                       });
                   }else{
                        res.status(200).send({result:"success",message:"no updates"});
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

//-----------------------------      API TO SHOW aboutus DETAILS       -----------------------------
exports.showaboutus = (req, res) => {        //PRIVACY API TO SHOW THE PRIVACY 
    var inputs=req.body;
    
    if(!inputs.id){
        console.log("not found input");
        return res.status(200).send({message: "id is required "});
    }
    else
    {
    Note.find({          //checks wether the user_id exist in privacy table
        "id": inputs.id 
    }).then(note=>{
        if(!note.length==0){
            res.status(200).send({result:"success",message:"user not found with this id in register table"});
        }else{
            Aboutus.find({          //checks wether the user_id exist in privacy table
                "user_id": inputs.id
            }).then(about1=>{
                if(about1.length==0){
                    var work=[];
                    var education=[];
                    var places_lived=[];
                    var contact_info=0;
                        const aboutc = new Aboutus({
                        user_id: inputs.id,
                        work:work,
                        education:education,
                        places_lived:places_lived,
                        contact_info : contact_info
                       },function(err,aboutc) {
                       if (err) return res.status(500).send({
                           result:"failed",message:"There Was A problem Inserting Data",errorMessage:err.message
                       });
                   })
                   aboutc.save() // this creates the database as about
                   .then(data21 => { 
                       res.status(200).send({result:"success",message:"about table ceated successfully",data:data21});
                   }).catch(err => {
                       res.status(500).send({
                           result:"failed",message:"Not Registered",errorMessage: err.message || "Some error occurred while creating the Note."
                       });
                   });
                }else{
                    var work=[];
                    var education=[];
                    var places_lived=[];
                    var contact_info=0;
                    var json={};
                    work=about1[0].work;
                    education=about1[0].education;
                    places_lived=about1[0].places_lived;
                    contact_info=about1[0].contact_info;
                   // user_id=about1[0].user_id;
                  //  json["user_id"]=user_id;
                    if(!work.length==0)
                    {
                        json["work"]=work;
                    }
                    else
                    {
                        json["work"]=[];
                    }
                    if(!education.length==0)
                    {
                        json["education"]=education;
                    }
                    else
                    {
                        json["education"]=[];
                    }
                    if(!places_lived.length==0)
                    {
                        json["places_lived"]=places_lived;
                    }
                    else
                    {
                        json["places_lived"]=[];
                    }
                    if(!contact_info==0)
                    {
                        json["contact_info"]=contact_info;
                    }
                    else
                    {
                        json["contact_info"]='';
                    }
                    res.status(200).send({result:"success",message:"data found",data:json});
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