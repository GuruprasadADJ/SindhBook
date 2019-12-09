const Note = require('../models/note.model.js');
const express=require('express');
var qs = require("querystring");
var http = require("http");
var datetime = require('node-datetime');

var dt = datetime.create();
var formatted='';
formatted = dt.format('d/m/Y H:M:S');


exports.editProfile = (req, res) => {
    data=req.params;
        Note.find({
            "_id": data.userId,
          }).then(note => {
            if(note.length==0)
            {
               res.status(200).send({result:"failed",message:"Data not found in database with this id "+ data.userId});
            }
            else
            {
                res.status(200).send({result:"success",message:"User profile details",data:note[0]});
            }
       }).catch(err => {
         res.status(500).send({result:"failed",message:"There was an exception",errorMessage:err.message || 'Some error occured'});
     });
       
 }