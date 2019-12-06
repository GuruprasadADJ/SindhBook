const Aboutus = require('../../models/aboutus.model.js');
const Note = require('../../models/note.model.js');

exports.deleteAboutDetails = (req, res) => {

console.log("start... about delete");
var inputs=req.body;
var workindex=inputs.workindex;
var educationindex=inputs.educationindex;
var places_livedindex=inputs.places_livedindex;
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
                    console.log("work",work);
                    console.log("adfdsf",workindex)
                    if(workindex)
                    {
                            work.splice(workindex,1);
                            console.log("a",work);
                            const about3=Aboutus.updateOne( //updates records in created record
                                {user_id:inputs.user_id}, 
                                {work:work
                            },function(err,about3) {
                                if (err){ return res.status(500).send({result:"failed",message:"There was a problem adding the information into the database."});
                                }else{
                                    res.status(200).send({result:"success",message:"About details deleted successfully",data:about1[0]});
                                }                             
                            })
                            
                    }
                    if(educationindex)
                    {
                            education.splice(educationindex,1);
                            console.log("a",education);
                            const about3=Aboutus.updateOne( //updates records in created record
                                {user_id:inputs.user_id}, 
                                {education:education
                            },function(err,about3) {
                                if (err){ return res.status(500).send({result:"failed",message:"There was a problem adding the information into the database."});
                                }else{
                                    res.status(200).send({result:"success",message:"About details deleted successfully",data:about1[0]});
                                }                             
                            })
                    }
                    if(places_livedindex)
                    {
                            places_lived.splice(places_livedindex,1);
                            console.log("a",education);
                            const about3=Aboutus.updateOne( //updates records in created record
                                {user_id:inputs.user_id}, 
                                {places_lived:places_lived
                            },function(err,about3) {
                                if (err){ return res.status(500).send({result:"failed",message:"There was a problem adding the information into the database."});
                                }else{
                                    res.status(200).send({result:"success",message:"About details deleted successfully",data:about1[0]});
                                }                             
                            }).catch(err => {
                                res.status(500).send({result:"failed",message:"There is an exception",errorMessage: err.message });
                            });
                            
                    }
                }
                else{
                    res.status(200).send({result:"success",message:"Please specify workindex or educationindex or places_livedindex"});
                }
            }).catch(err => {
                res.status(500).send({result:"failed",message:"There is an exception",errorMessage: err.message });
            });
        }
        else{
            res.status(200).send({result:"success",message:"Id not found in register table"});
        }
    }).catch(err => {
        res.status(500).send({result:"failed",message:"There is an exception",errorMessage: err.message });
    });
}
