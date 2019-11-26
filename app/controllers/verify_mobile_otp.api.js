//const signin = require('../models/login.model.js');
const Note = require('../models/note.model.js');
const express=require('express');
var data='';
exports.verifyotp = (req, res) =>{
     var input=req.body.otp;
     var id=req.body.id;
    if(!id || !input) {
        return res.status(200).send({
            result:"failed",message: "Please enter valid Id or Otp"
        });
    }
     Note.find({
        "_id": id,
      }).then(note => {
        if(note.length == 0){
            res.status(200).send({result:"failed",message: 'Otp not found. Please verify it again'});
        }
        else{
           //update otp status
           if(input=='123456')
           {
           const note1=Note.updateOne(
            {_id:id},
            {otp_status: 1},
            function(err,note1) {
             if (err)
             {
                return res.status(500).send({result:"failed",message:"There was a problem adding the information to the database."});
             } 
             else{
                Note.find({
                    "_id": id,
                  }).then(note => {

                    res.status(200).send({result:"success",message:"Otp verified successfully",data:note[0]});
                  })
             }
            
            });
           }
           else
           {
            res.status(200).send({result:"failed",message:"Please enter valid otp"});
           }
        }
       
    }).catch(err => {
        console.log("Exception")
        res.status(500).send({result:"failed",message:"Some error occurred while verifying otp.",errorMessage:err.message});
    })
    
};