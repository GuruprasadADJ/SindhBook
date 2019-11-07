//const signin = require('../models/login.model.js');
const Note = require('../models/note.model.js');
const express=require('express');
var data='';
exports.verifyotp = (req, res) =>{
     var input=req.body.otp;
    if(!input) {
        return res.status(200).send({
            result:"failed",message: "Otp content can not be empty"
        });
    }
     Note.find({
        "otp": input,
      }).then(note => {
        if(note.length == 0){
            res.status(200).send({result:"failed",message: 'Otp not found. Please verify it again'});
        }
        else{
           //update otp status
           const note1=Note.updateOne(
            {otp:input},
            {otp_status:1},
            function(err,note1) {
             if (err) return res.status(500).send({result:"failed",message:"There was a problem adding the information to the database."});
            res.status(200).send({result:"success",message:"Otp verified successfully",data:note});
            });
             //</update otp status>
        }
       
    }).catch(err => {
        console.log("Exception")
        res.status(500).send({
           result:"failed",
           message:"Some error occurred while verifying otp."
        });
    })
    
};