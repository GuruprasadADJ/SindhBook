const Aboutus = require('../../models/aboutus.model.js');
const Note = require('../../models/note.model.js');

var flag=0;
exports.createabout = (req, res) => {    
console.log("inputs coming", req.body.id);
var inputs=req.body;

if(!inputs.id){
    console.log("not found input");
    return res.status(200).send({result:"success",message: "Please enter id"});
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
            return res.status(200).send({result:"failed",message: "Data not found in register table with this id "+inputs.id});            
        }else{
        console.log("data found");
        Aboutus.find({          
            "user_id": inputs.id
        }).then(about1 => {
            if(about1.length==0) 
            {     
                if(inputs.work||inputs.education||inputs.places_lived||note[0].mobile_no)
                {                                
                    var work1=[];
                    var education1=[];
                    var places_lived1=[]
                        if(inputs.work)
                            {
                                work1.push({"name":inputs.work});
                            }
                            if(inputs.education)
                            {
                                education1.push({"name":inputs.education});
                            }
                            if(inputs.places_lived)
                            {
                                places_lived1.push({"name":inputs.places_lived});
                            }
                    const about2 = new Aboutus({
                        user_id: inputs.id,
                        work:work1,
                        education:education1,
                        places_lived:places_lived1,
                        contact_info : note[0].mobile_no||''
                    },function(err,about2) {
                    if (err) return res.status(500).send({
                        result:"failed",message:"There was a problem inserting data into database",errorMessage: err.message
                    });
                })
                about2.save() // this creates the database as privacy
                .then(data => { 
                    res.status(200).send({result:"success",message:"Inserted about details successfully",data:data});
                }).catch(err => {
                    res.status(500).send({
                        result:"failed",message:"There was an exception while inserting data",errorMessage: err.message || "Some error occurred while creating the Note."
                    });
                });

                }else{
                res.status(200).send({result:"failed",message:"Something is wrong, Please enter any about details"});
                }
            }
            else if(!about1.length==0)
            {                 
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
                                work1.push({"name":inputs.work});
                            }
                            if(inputs.education)
                            {
                                education1.push({"name":inputs.education});
                            }
                            if(inputs.places_lived)
                            {
                                places_lived1.push({"name":inputs.places_lived});
                            }
                    const about3=Aboutus.updateMany( //updates records in created record
                        {user_id:inputs.id}, 
                        {work:work1,
                        education:education1,
                        places_lived:places_lived1,
                        contact_info : note[0].mobile_no||''
                    },function(err,about3) {
                        if (err){ return res.status(500).send({result:"failed",message:"There was a problem adding the information into the database."});
                        }else{
                            res.status(200).send({result:"success",message:"About details updated successfully",data:about1[0]});
                        }                             
                        }).catch(err => {
                            res.status(500).send({
                                result:"failed",message:"There was an exception while inserting data",errorMessage: err.message || "Some error occurred while creating the Note."
                        });
                    });
                }else{
                    res.status(200).send({result:"success",message:"No changes done"});
                }
                }
        });
        }
    }).catch(err => {
        res.status(500).send({
            result:"failed",message:"There was an exception while fetching data in registers table",errorMessage: err.message || "Some error occurred while creating the Note."
        });
    });  
}       
}

//************************************ */      API TO SHOW aboutus DETAILS       /************************** */
//********************************************************************************************************** */
exports.showaboutdetails = (req, res) => {   
    Note.findById(req.params.about1Id)
    .then(note=>{
            if(!note){
                return res.status(200).send({result:'failed',
                   message: "Data not found in register table" + req.params.about1Id
               });

            }
            else{
                var input=req.params.about1Id;
                Aboutus.find({          //checks wether the user_id exist in privacy table
                    "user_id": input
                }).then(about1=>{
                    if(about1.length==0){
                            var json={};
                            json["work"]=[];
                            json["education"]=[];
                            json["places_lived"]=[];
                            json["contact_info"]='';
                       
                        res.status(200).send({result:"success",message:"No data found",data:json});
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
                        res.status(200).send({result:"success",message:"Data found",data:json});
                    }
                }).catch(err => {
                    res.status(500).send({
                        result:"failed",message:"There was an exception",errorMessage: err.message || "Some error occurred while creating the Note."
                    });
                })
            }
      
        })
}