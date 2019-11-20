const Note = require('../models/note.model.js');
const express=require('express');
var qs = require("querystring");
var http = require("http");
var datetime = require('node-datetime');

var dt = datetime.create();
var formatted='';
 formatted = dt.format('d/m/Y H:M:S');

// Create and Save a new user
var otp='';
var data='';
var last_insertid='';


exports.create = (req, res) => {
var flag=0;
var flag1=0;
var inputs=req.body;
last_insertid='';
console.log("datetime==",formatted);
if(inputs.registered_by==0)
{
 if(!inputs.mobile_no) 
 {
    return res.status(200).send({result:"failed",message: "Mobile Number can not be empty"});
 }
 else
 {
  Note.find({"mobile_no": inputs.mobile_no}).then(note => {
    console.log('going',note);
    if(note.length == 0){
       flag=1;
    }
    if(flag==1){        
        // Create a register           
            otp=random(6);
            var formatted_dob='';
            if(!inputs.dob)
            {

            }
            else{
                formatted_dob=inputs.dob.format('yyyy-mm-dd')
            }
            const note = new Note({
            mobile_no: inputs.mobile_no,
            otp: otp,
            otp_status: 0,
            device_token: inputs.device_token || '',
            profile_update_status: 0,
            paid_user_status: 0,
            user_type: 0,
            user_login_type: 0,
            created_at:formatted,
            modified_at: '',
            last_login: '',
            registered_by: inputs.registered_by || 0,
            first_name: inputs.first_name || '',
            last_name: inputs.last_name || '',
            gender:inputs.gender || '',
            dob: formatted_dob || '',
            email: inputs.email || '',
            email_otp: '' ,
            email_otp_status: 0,
            profile_picture: inputs.profile_picture || '',
            fb_gmail_id:inputs.fb_gmail_id || '',
            user_block_status:inputs.user_block_status || 0,
            profile_type:inputs.profile_type||''
        },function(err,note) {
            if (err) return res.status(500).send({result:"failed",message:"There Was A problem Inserting Data",errorMessage:err.message});
        });
        // Save Note in the database
        note.save()
        .then(data => {
            //sendotp(data.mobile_no,otp);
            last_insertid=data.id;
            console.log('inserted data',last_insertid);
            res.status(200).send({
                result:"success",message:"Registered Successfully",data:{"_id":data.id,"mobile_no":data.mobile_no,"otp":data.otp}
            });
        }).catch(err => {
            res.status(500).send({
                result:"failed",message:"Not Registered",errorMessage: err.message || "Some error occurred while creating the Note."
            });
        });
        }
        else
        {   
            res.status(200).send({result:"success",message:"user already exist",data:note[0]});
        }
}).catch(err => {
    console.log("Exception")
    res.status(500).send({
        result:"failed",message:"Not Registered Successfully",errorMessage:err.message
    });
})
}
}
else if(inputs.registered_by==1||inputs.registered_by==2){    
    //register by facebook or gmail
    // Create a Note
    Note.find({"fb_gmail_id": inputs.fb_gmail_id}).then(note1 => {
        console.log('going',note1);
        if(note1.length == 0){
           flag1=1;
        }
        if(flag1==1){
            var formatted_dob='';
            if(!inputs.dob)
            {
                
            }
            else{
                formatted_dob=inputs.dob.format('yyyy-mm-dd')
            }
            const note1 = new Note({
                mobile_no: inputs.mobile_no || "",
                otp: '',
                otp_status: 0,
                device_token: inputs.device_token || '',
                profile_update_status: 0,
                paid_user_status: 0,
                user_type: 0,
                user_login_type: 0,
                created_at:formatted,
                modified_at: '',
                last_login: formatted,
                registered_by: inputs.registered_by , //field data mandatory
                first_name: inputs.first_name || '',
                last_name: inputs.last_name|| '',
                gender: '',
                dob: formatted_dob  || '',
                email: inputs.email || '',
                email_otp: '',
                email_otp_status: 0,
                profile_picture: inputs.profile_picture || '',
                fb_gmail_id:inputs.fb_gmail_id , //field data mandatory
                user_block_status:inputs.user_block_status || 0,
                profile_type:inputs.profile_type||''
            },function(err,note1) {
                if (err) return res.status(500).send({result:"failed",message:"Not Registered Successfully",errorMessage:err.message});
            });
            
            // Save Note in the database
            note1.save()
            .then(data => {        
                last_insertid=data.id;
                console.log('inserted data',last_insertid);
                res.status(200).send({
                    result:"success",message:"Registered Successfully",data:data
                });
            }).catch(err => {
                res.status(500).send({
                    result:"failed",message:"Not Registered Successfully",errorMessage:err.message
                });
            });
        }
        else{
            res.status(200).send({result:"success",message:"user already exist",data:note1[0]});
        }
    }).catch(err => {
        res.status(500).send({
            result:"failed",message:"Not Registered",errorMessage: err.message || "Some error occurred while creating the Note."
        });
   }); 
   
}
else{
    res.status(200).send({
        result:"failed",message:"Check the json format or registered by can not be empty"
    });
}
};
//--------------------------Otp Send Code------------------------------------
    console.log('sending');
    function sendotp(phone_no,otp){
        var options = {
            "method": "GET",
            "hostname": "2factor.in",
            "port": null,
            "path": "/API/V1/76263c6b-fc6d-11e9-9fa5-0200cd936042/SMS/"+phone_no+"/"+otp+"",
            "headers": {
            "content-type": "application/x-www-form-urlencoded"
            }
            };
        
            var req = http.request(options, function (res) {
            var chunks = [];
        
            res.on("data", function (chunk) {
            chunks.push(chunk);
            });
        
            res.on("end", function () {
            var body = Buffer.concat(chunks);
            console.log(body.toString());
            });
            });
        
            req.write(qs.stringify({}));
            req.end();
            return otp;
    }
// ----- Changes In Register File------------------
//--------------------------Otp Send Code End--------------------------------

//--------------------------Otp Generation Code------------------------------

function random(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
   return result;
  }
//--------------------------Otp Generation Code End-----------------------------
    
//========================================== UPDATE USER PROFILE API =============================================
exports.update = (req, res) => {
    data=req.body;
    var flag=0;
    var flag1=0;
    console.log('ok')
    if(!data.mobile_no){
     const note1=Note.update(
         {_id:data.id},
        {
         mobile_no:data.mobile_no||'',
         first_name: data.first_name || '',
         last_name: data.last_name || '',
         gender: data.gender || '',
         dob: data.dob || '',
         modified_at: formatted,
         email: data.email || '',
         email_otp: 0,
         email_otp_status: 0,
         profile_picture: data.profile_picture || '',
         profile_type:data.profile_type||'',
         profile_update_status:1,
         profile_type:data.profile_type||''
        },
        function(err,note1) {
           if (err) return res.status(200).send({result:"failed",message:"Profile Not Updated",errorMessage:'Some error occured or id is not exist in database'});
            console.log("res=",note1);
 
        Note.find({"_id": data.id}).then(note => {
           res.status(200).send({result:"success",message:"Profile Updated",data:note[0]});
        });
     
         //res.status(200).send({result:"success",message:"Profile Updated"});
        }).catch(err => {
            res.status(500).send({result:"failed",message:"Profile Not Updated",errorMessage:err.message || 'Some error occured'});
        }); 
    }else{
       Note.find({
           "_id": data.id,
          // "mobile_no":data.mobile_no,
         //  "profile_update_status":data.profile_update_status
         }).then(note => {
             //console.log("finding mobile no");
           if(note.length==0){
              res.status(200).send({result:"failed",message:"id not found"});
           }else
           {
             Note.find({
                 //"_id": data.id,
                 "mobile_no":data.mobile_no,
               //  "profile_update_status":data.profile_update_status
               }).then(note => {
                 if(note.length==0){
                     const note1=Note.update(
                         {_id:data.id},
                     {
                     mobile_no:data.mobile_no||'',
                     first_name: data.first_name || '',
                     last_name: data.last_name || '',
                     gender: data.gender || '',
                     dob: data.dob || '',
                     modified_at: formatted,
                     email: data.email || '',
                     email_otp: 0,
                     email_otp_status: 0,
                     profile_picture: data.profile_picture || '',
                     profile_type:data.profile_type||'',
                     profile_update_status:1,
                     profile_type:data.profile_type||''
                 },
                 function(err,note1) {
                     if (err) return res.status(200).send({result:"failed",message:"Profile Not Updated",errorMessage:'Some error occured or id is not exist in database'});
                     console.log("res=",note1);
 
                 Note.find({"_id": data.id}).then(note => {
                     res.status(200).send({result:"success",message:"Profile Updated1",data:note[0]});
                 });
                 
                     //res.status(200).send({result:"success",message:"Profile Updated"});
                 }).catch(err => {
                     res.status(500).send({result:"failed",message:"Profile Not Updated",errorMessage:err.message || 'Some error occured'});
                 }); 
                  }
                  else
                  {
                      console.log("gender",data.gender);
                     var server_id=note[0]._id;
                     if(server_id==data.id){
                         const note1=Note.update(
                             {_id:data.id},
                         {
                         mobile_no:data.mobile_no||'',
                         first_name: data.first_name || '',
                         last_name: data.last_name || '',
                         gender: data.gender || '',
                         dob: data.dob || '',
                         modified_at: formatted,
                         email: data.email || '',
                         email_otp: 0,
                         email_otp_status: 0,
                         profile_picture: data.profile_picture || '',
                         profile_type:data.profile_type||'',
                         profile_update_status:1,
                         profile_type:data.profile_type||''
                     },
                     function(err,note1) {
                         if (err) return res.status(200).send({result:"failed",message:"Profile Not Updated",errorMessage:'Some error occured or id is not exist in database'});
                         console.log("res=",note1);
     
                     Note.find({"_id": data.id}).then(note => {
                         res.status(200).send({result:"success",message:"Profile Updated",data:note[0]});
                     });
                     
                         //res.status(200).send({result:"success",message:"Profile Updated"});
                     }).catch(err => {
                         res.status(500).send({result:"failed",message:"Profile Not Updated",errorMessage:err.message || 'Some error occured'});
                     });                
                     }
                     else
                     {
                         res.status(200).send({result:"failed",message:"Mobile number is already exist"});
                     }
                 }
             })
           }
      });
     }
 }