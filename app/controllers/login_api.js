    //const signin = require('../models/login.model.js');
    const Note = require('../models/note.model.js');

    var data='';
    exports.Authenticate = (req, res) =>{
    //validate input data
    if(!req.body.fb_gmail_id && !req.body.mobile_no)
    {
        return res.status(404).send({result:"failed",message: "Content can not be empty"});
    }
    else if(!req.body.fb_gmail_id) {
    Note.find({
    "mobile_no": req.body.mobile_no,
    // "otp_status":1
    }).then(note => {
    if(note.length == 0){
    res.status(404).send({result:"failed",message: 'login failed, User not found'});
    }else{
    var otp_status=note[0].otp_status;
    var pupdate_status=note[0].profile_update_status;
    if(otp_status==1 && pupdate_status==1 ){
    res.status(200).send({result:"success",message : "login successful"});
    }else if(otp_status==1 && pupdate_status==0){
    res.status(200).send({result:"success",message : "login successful",profie_update_status:pupdate_status});
    }else if(otp_status==0 && pupdate_status==0){
    res.status(404).send({result:"failed",message : "login failed, verify mobile number",otp_verified_status:otp_status});
    }
    }

    }).catch(err => {
    console.log("Exception")
    res.status(500).send({
        result:"failed",message:"Not Login Successfully",errorMessage:err.message
    });
    })
    }
    else{
        Note.find({
        "fb_gmail_id": req.body.fb_gmail_id,
        // "otp_status":1
        }).then(note => {
        if(note.length == 0){
        res.status(404).send({result:"failed",message: 'login failed, This account is not registered'});
        }else{
        var pupdate_status=note[0].profile_update_status;
        if(pupdate_status==1 ){
        res.status(200).send({result:"success",message : "login successful"});
        }else{
        res.status(404).send({result:"success",message : "login successful",profie_update_status:pupdate_status});
        }
        }
    
        }).catch(err => {
        console.log("Exception")
        res.status(500).send({
            result:"failed",message:"Not Login Successfully",errorMessage:err.message
        });
        })
    }
    };