const Note = require('../models/note.model.js');
const express=require('express');
var qs = require("querystring");
var http = require("http");
var datetime = require('node-datetime');
var dt = datetime.create();
var formatted = dt.format('d/m/Y H:M:S');
// Create and Save a new user
var last_insertid='';
var flag1=0;
exports.create = (req, res) => {
    var flag=0;
    var inputs=req.body;
    last_insertid='';
    // Validate request
 if(!req.body.mobile_no) {
    return res.status(400).send({
        message: "Note content can not be empty1"
    });
}//generates random otp
function random(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
   return result;
  }
var otp=random(6);
  Note.find({
    "mobile_no": inputs.mobile_no,
   }).then(note => {
    console.log('going',note);
    if(note.length == 0){
       flag=1;
    }else if(note.length != 0){   
        flag=0;     
          //  res.status(500).send({message: 'user already exist'});
    }
    if(flag==1){
        //send otp sms
    // console.log('sending');
    // var options = {
    //     "method": "GET",
    //     "hostname": "2factor.in",
    //     "port": null,
    //     "path": "/API/V1/76263c6b-fc6d-11e9-9fa5-0200cd936042/SMS/"+data+"/"+otp+"",
    //     "headers": {
    //       "content-type": "application/x-www-form-urlencoded"
    //     }
    //   };
      
    //   var req = http.request(options, function (res) {
    //     var chunks = [];
      
    //     res.on("data", function (chunk) {
    //       chunks.push(chunk);
    //     });
      
    //     res.on("end", function () {
    //       var body = Buffer.concat(chunks);
    //       console.log(body.toString());
    //     });
    //   });
      
    //   req.write(qs.stringify({}));
    //   req.end();
    //</send otp sms>
        // Create a Note
        const note = new Note({
            mobile_no: inputs.mobile_no,
            otp: otp,
            otp_status: 0,
            device_token: 0,
            profile_update_status: 0,
            paid_user_status: 0,
            user_type: 0,
            user_login_type: 0,
            created_at:formatted,
            modified_at: formatted,
            last_login: formatted,
            registered_by: 0,
            first_name: 'enter first name',
            last_name: 'data.last_name',
            gender: 0,
            dob: 'formatted',
            email: 'data.email',
            email_otp: 'data.email_otp',
            email_otp_status: 0,
            profile_picture: 'data.profile_picture'
        },function(err,note) {
            if (err) return res.status(500).send("There was a problem adding the information to the database.");
        });
        
        // Save Note in the database
        note.save()
        .then(data => {
            last_insertid=data.id;
            console.log('inserted data',last_insertid);
            res.send(data);
        }).catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while creating the Note."
            });
        });
        }else{
            res.status(500).send({message: 'user already exist'});
        }
}).catch(err => {
    console.log("Exception")
    res.status(500).send({
       message:  err.message ||"Some error occurred while retrieving notes."
     // message: 'user does not exist'
    });
})
};

//-------------------------- UPDATE USER PROFILE API ------------------------
exports.update = (req, res) => {
   data=req.body;
   console.log('ok')
        const note1=Note.update(
            {_id:last_insertid},
            {first_name: data.first_name,
             last_name: data.last_name,
             gender: data.gender,
             dob: formatted,
             email: data.email,
             email_otp: data.email_otp,
             email_otp_status: data.email_otp_status,
             profile_picture: data.profile_picture,
             profile_update_status:1},
            function(err,note1) {
             if (err) return res.status(500).send("There was a problem adding the information to the database.");
             console.log("res=",note1);
              res.status(200).send({profile_update_status:'1'});
            }).catch(err => {
                res.status(500).send({
                    message: err.message || "Some error occurred while creating the Note."
                });
            });        
}