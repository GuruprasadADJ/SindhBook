//const signin = require('../models/login.model.js');
const Note = require('../models/note.model.js');

var data='';
exports.Authenticate = (req, res) =>{
     //validate input data
    if(!req.body.mobile_no) {
        return res.status(400).send({
            message: "Note content can not be empty"
        });
    }
     Note.find({
        "mobile_no": req.body.mobile_no,
       // "otp_status":1
    }).then(note => {
        console.log('going',note);
        if(note.length == 0){
            console.log("!note", note)
                    res.status(404).send({message: 'User not found'});
        }else if(note.length != 0){
            console.log("here")
            data = note[0].otp_status;       
            console.log("data: ",data)     
            console.log("DATA  :", note[0].otp_status);
            console.log("ID :  ", note[0]._id);
            if(data==1){
                res.status(200).send({message : note[0]});
            }else{
                res.status(500).send({message: 'verify user phone number'});
            }
        }
       
    }).catch(err => {
        console.log("Exception")
        res.status(500).send({
           message:  err.message ||"Some error occurred while retrieving notes."
         // message: 'user does not exist'
        });
    })
    
};