//const signin = require('../models/login.model.js');
const Note = require('../models/note.model.js');
const express=require('express');
var data='';
exports.verifyotp = (req, res) =>{
     var input=req.body.otp;
    if(!input) {
        return res.status(400).send({
            status:"Failure",message: "Otp content can not be empty"
        });
    }
     Note.find({
        "otp": input,
      }).then(note => {
        if(note.length == 0){
            res.status(404).send({status:"failure",message: 'Otp not found. Please verify it again'});
        }
        else{
           //update otp status
           const note=Note.update(
            {otp:input},
            {otp_status:1},
            function(err,note) {
             if (err) return res.status(500).send({status:"failure",message:"There was a problem adding the information to the database."});
            res.status(200).send({status:"success",message:"Otp verified successfully"});
            });
             //</update otp status>
        }
       
    }).catch(err => {
        console.log("Exception")
        res.status(500).send({
           status:"failure",
           message:"Some error occurred while verifying otp."
        });
    })
    
};