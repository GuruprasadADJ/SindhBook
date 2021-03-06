const Aboutus = require('../../models/aboutus.model.js');
const Note = require('../../models/note.model.js');

exports.deleteAboutDetails = (req, res) => {

console.log("start... about delete");
var inputs=req.body;
var deviceId=req.body.deviceId;
var workindex=inputs.workindex;
var educationindex=inputs.educationindex;
var places_livedindex=inputs.places_livedindex;
var contact_infoindex=inputs.contact_infoindex;
console.log("got input");
    Note.findById(inputs.user_id)
    .then(note => {
        console.log(note);
        if(note)
        {
            if(deviceId){
            //update device token
            var device_array=[];
            device_array=(note.deviceId);            
            if(device_array.includes(deviceId)){
                console.log("Token Found");
            }
            else if(device_array.length==0){
                device_array.push(deviceId);
                console.log("Token Not Found");
                const updatedevice=Note.updateOne( 
                    {_id: inputs.user_id}, 
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
                    {_id: inputs.user_id}, 
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

            Aboutus.find({          
                "user_id": inputs.user_id
            }).then(about1 => {
                console.log(about1);
                var work=about1[0].work;
                var education=about1[0].education;
                var places_lived=about1[0].places_lived;
                var contact_info=about1[0].contact_info;
                if(workindex||educationindex||places_livedindex||contact_infoindex)
                {
                    console.log("work",work);
                    console.log("adfdsf",workindex)
                    if(workindex)
                    {
                            work.splice(workindex,1);
                            console.log("a",work);
                            const about3=Aboutus.updateMany( //updates records in created record
                                {user_id:inputs.user_id}, 
                                {work:work,
                                 deviceId:deviceId
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
                            const about3=Aboutus.updateMany( //updates records in created record
                                {user_id:inputs.user_id}, 
                                {education:education,
                                 deviceId:deviceId
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
                            console.log("places_lived :",places_lived);
                            const about3=Aboutus.updateMany( //updates records in created record
                                {user_id:inputs.user_id}, 
                                {places_lived:places_lived,
                                 deviceId:deviceId
                            },function(err,about3) {
                                if (err){ return res.status(500).send({result:"failed",message:"There was a problem adding the information into the database."});
                                }else{
                                    res.status(200).send({result:"success",message:"About details deleted successfully",data:about1[0]});
                                }                             
                            }).catch(err => {
                                res.status(500).send({result:"failed",message:"There is an exception",errorMessage: err.message });
                            });
                            
                    }
                    if(contact_infoindex)
                    {
                            contact_info.splice(contact_infoindex,1);
                            console.log("contact_info :",contact_info);
                            const about3=Aboutus.updateMany( //updates records in created record
                                {user_id:inputs.user_id}, 
                                {contact_info:contact_info,
                                 deviceId:deviceId
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
                    res.status(200).send({result:"success",message:"Please specify workindex or educationindex or places_livedindex or contact_infoindex"});
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
