//const signin = require('../models/login.model.js');
const Note = require('../models/note.model.js');
const express=require('express');
var data='';
exports.verifyotp = (req, res) =>{
     var input=req.body.otp;
    if(!input) {
        return res.status(200).send({
            result:"Failed",message: "Please enter valid otp"
        });
    }
     Note.find({
        "otp": input,
      }).then(note => {
        if(note.length == 0){
            res.status(200).send({result:"Failed",message: 'Otp not found. Please verify it again'});
        }
        else{
           //update otp status
           const note1=Note.updateOne(
            {otp:input},
            {otp_status:1},
            function(err,note1) {
             if (err)
             {
                return res.status(500).send({result:"Failed",message:"There was a problem adding the information to the database."});
             } 
             else{
                res.status(200).send({result:"Success",message:"Otp verified successfully",data:note[0]});
             }
            
            });
        }
       
    }).catch(err => {
        console.log("Exception")
        res.status(500).send({result:"Failed",message:"Some error occurred while verifying otp.",errorMessage:err.message});
    })
    
};