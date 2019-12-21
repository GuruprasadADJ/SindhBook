const Aboutus = require('../../models/aboutus.model.js');
const Note = require('../../models/note.model.js');

exports.updateAboutDetails = (req, res) => {
console.log("strt.........")
var inputs=req.body;
var deviceId=req.body.deviceId;
var workindex=inputs.workindex;
var educationindex=inputs.educationindex;
var places_livedindex=inputs.places_livedindex;
var contact_infoindex=inputs.contact_infoindex;
var work1=inputs.work;
var education1=inputs.education;
var places_lived1=inputs.places_lived;
var contact_info1=inputs.contact_info;
console.log("got input");
    Note.findById(inputs.user_id)
    .then(note => {
        console.log(note.length);
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
                    if(workindex && work1)
                    {       
                            for(var i=0;i<work.length;i++){
                                
                                console.log("work1",i,work[i].name)
                                if(i==workindex)
                                {
                                    console.log("befor_work[i] - ",work[i]);
                                    work[i].name=work1;
                                    console.log("after_work[i] - ",work[i]);
                                }
                            }
                            console.log("a : ",work);
                            const about3=Aboutus.updateMany( //updates records in created record
                                {user_id:inputs.user_id},
                                {work:work,
                                 deviceId:deviceId
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
                            if(i==educationindex)
                            {
                                console.log("befor_education[i] - ",education[i]);
                                education[i].name=education1;
                                console.log("after_education[i] - ",education[i]);
                            }
                        }
                        console.log("a : ",education);
                        const about3=Aboutus.updateMany( //updates records in created record
                            {user_id:inputs.user_id},
                            {education:education,
                             deviceId:deviceId
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
                            if(i==places_livedindex)
                            {
                                console.log("befor_education[i] - ",places_lived[i]);
                                places_lived[i].name=places_lived1;
                                console.log("after_education[i] - ",places_lived[i]);
                            }
                        }
                        console.log("a : ",places_lived);
                        const about3=Aboutus.updateMany( //updates records in created record
                            {user_id:inputs.user_id},
                            {places_lived:places_lived,
                             deviceId:deviceId
                        },function(err,about3) {
                            if (err){ return res.status(500).send({result:"failed",message:"There was a problem adding the information into the database."});
                            }else{
                                res.status(200).send({result:"success",message:"About details updated successfully",data:about1[0]});
                            }                             
                        })
                    }
                    if(contact_infoindex && contact_info1)
                    {
                        for(var i=0;i<contact_info.length;i++){
                            if(i==contact_infoindex)
                            {
                                console.log("before_contact_info[i] - ",contact_info[i]);
                                contact_info[i].name=contact_info1;
                                console.log("after_contact_info[i] - ",contact_info[i]);
                            }
                        }
                        console.log("a : ",contact_info);
                        const about3=Aboutus.updateMany( //updates records in created record
                            {user_id:inputs.user_id},
                            {contact_info:contact_info,
                             deviceId:deviceId
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
