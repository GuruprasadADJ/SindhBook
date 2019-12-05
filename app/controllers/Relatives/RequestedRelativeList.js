const Note=require('../../models/note.model.js');
const Relative=require('../../models/Relative_models/relatives.model.js');
const moment = require('moment'); //to parse the default date of mongodb

exports.RequestedRelativeList = (req, res) => {    
    var inputs=req.params;
    var user_id=inputs.userId;
    console.log("user_id="+user_id);
    Note.find({
        "_id": user_id
    }).then(note=>{
       if(note.length!=0)
       { 
        Relative.find({
            "user_id": user_id
        }).then(request=>{
            if(request.length!=0)
            {
                var requested_list=request[0].r_requested_list;
                res.status(200).send({result:"success",message:"Requested Relative List",data:requested_list});
            }
            else
            {
               res.status(200).send({result:"success",message:"No Requested Relative List found for this userid",data:[]});
            }
        }).catch(err => {
            res.status(500).send({result:"failed",message:"There was an exception",errorMessage: err.message});
        }); 
       }
       else
       {
        res.status(200).send({result:"success",message:"No record found for this user id in database"});
       }
    }).catch(err => {
        res.status(500).send({result:"failed",message:"There was an exception",errorMessage: err.message});
    });
}
