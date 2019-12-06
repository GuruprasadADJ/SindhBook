const Aboutus = require('../../models/aboutus.model.js');
const Note = require('../../models/note.model.js');

exports.updateAboutDetails = (req, res) => {
console.log("strt.........")
console.log("start... about delete");
var inputs=req.body;
var workindex=inputs.workindex;
var educationindex=inputs.educationindex;
var places_livedindex=inputs.places_livedindex;
var work1=inputs.work;
var education1=inputs.education;
var places_lived1=inputs.places_lived;
console.log("got input");
    Note.find({             //checks  weather the user_id exist in register table
        "_id": inputs.user_id
    })
    .then(note => {
        console.log(note.length);
        if(note.length!=0)
        {
            Aboutus.find({          
                "user_id": inputs.user_id
            }).then(about1 => {
                console.log(about1);
                var work=about1[0].work;
                var education=about1[0].education;
                var places_lived=about1[0].places_lived;
                if(workindex||educationindex||places_livedindex)
                {
                    if(workindex && work1)
                    {       
                            for(var i=0;i<work.length;i++){
                                if(work[i]==workindex)
                                {
                                    console.log("befor_work[i] - ",work[i]);
                                    work[i].name=work1;
                                    console.log("after_work[i] - ",work[i]);
                                }
                            }
                            console.log("a : ",work);
                            const about3=Aboutus.updateOne( //updates records in created record
                                {user_id:inputs.user_id},
                                {work:work
                            },function(err,about3) {
                                if (err){ return res.status(500).send({result:"failed",message:"There was a problem adding the information into the database."});
                                }else{
                                    res.status(200).send({result:"success",message:"About details updated successfully",data:about1[0]});
                                }                             
                            }).catch(err => {
                                res.status(500).send({result:"failed",message:"There is an exception",errorMessage: err.message });
                            });
                            
                    }
                    if(educationindex && education1)
                    {
                        for(var i=0;i<education.length;i++){
                            if(education[i]==educationindex)
                            {
                                console.log("befor_education[i] - ",education[i]);
                                education[i].name=education1;
                                console.log("after_education[i] - ",education[i]);
                            }
                        }
                        console.log("a : ",education);
                        const about3=Aboutus.updateOne( //updates records in created record
                            {user_id:inputs.user_id},
                            {education:education
                        },function(err,about3) {
                            if (err){ return res.status(500).send({result:"failed",message:"There was a problem adding the information into the database."});
                            }else{
                                res.status(200).send({result:"success",message:"About details updated successfully",data:about1[0]});
                            }                             
                        }).catch(err => {
                            res.status(500).send({result:"failed",message:"There is an exception",errorMessage: err.message });
                        });
                            
                    }
                    if(places_livedindex && places_lived1)
                    {
                        for(var i=0;i<places_lived.length;i++){
                            if(places_lived[i]==places_livedindex)
                            {
                                console.log("befor_education[i] - ",places_lived[i]);
                                places_lived[i].name=places_lived1;
                                console.log("after_education[i] - ",places_lived[i]);
                            }
                        }
                        console.log("a : ",places_lived);
                        const about3=Aboutus.updateOne( //updates records in created record
                            {user_id:inputs.user_id},
                            {places_lived:places_lived
                        },function(err,about3) {
                            if (err){ return res.status(500).send({result:"failed",message:"There was a problem adding the information into the database."});
                            }else{
                                res.status(200).send({result:"success",message:"About details updated successfully",data:about1[0]});
                            }                             
                        })
                            
                    }
                }
            }).catch(err => {
                res.status(500).send({result:"failed",message:"There is an exception",errorMessage: err.message });
            });
        }
        else{
            res.status(200).send({result:"success",message:"Id not found in register table"});
        }
    })
}
