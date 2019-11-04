//const signin = require('../models/login.model.js');
const Note = require('../models/note.model.js');
const express=require('express');
var data='';
exports.verifyotp = (req, res) =>{
     var input=req.body.otp;
    if(!input) {
        return res.status(400).send({
            message: "Note content can not be empty"
        });
    }
     Note.find({
        "otp": input,
      }).then(note => {
        console.log('going',note);
        if(note.length == 0){
            console.log("!note")
            res.status(404).send({message: 'otp not found'});
        }
        else if(note.length != 0){
            console.log('verifiying');
           //update otp status
           const note=Note.update(
            {otp:input},
            {otp_status:1},
            function(err,note) {
             if (err) return res.status(500).send("There was a problem adding the information to the database.");
             console.log("res=",note);
                 res.status(200).send({otp_status:'1'});
            });
             //</update otp status>
        }
       
    }).catch(err => {
        console.log("Exception")
        res.status(500).send({
           message:  err.message ||"Some error occurred while retrieving notes."
         // message: 'user does not exist'
        });
    })
    
};