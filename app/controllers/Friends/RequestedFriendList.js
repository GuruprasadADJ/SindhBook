const Note=require('../../models/note.model.js');
const Friend=require('../../models/Friends/friends.model1.js');
const moment = require('moment'); //to parse the default date of mongodb

exports.RequestedFriendList = (req, res) => {    
    var inputs=req.params;
    var user_id=inputs.userId;
    console.log("user_id="+user_id);
    Note.find({
        "_id": user_id
    }).then(note=>{
       if(note.length!=0)
       { 
        Friend.find({
            "user_id": user_id
        }).then(request=>{
            if(request.length!=0)
            {
                var requested_list=request[0].requested_list;
                res.status(200).send({result:"success",message:"Requested List",data:requested_list});
            }
            else
            {
               res.status(200).send({result:"success",message:"No Request found for this userid",data:[]});
            }
        }).catch(err => {
            res.status(500).send({
              result:"failed",message:"There was an exception",errorMessage: err.message || "Some error occurred while creating the Note."
        });
        }); 
       }
       else
       {
        res.status(200).send({result:"success",message:"No record found for this user id in database"});
       }
    }).catch(err => {
        res.status(500).send({
          result:"failed",message:"There was an exception",errorMessage: err.message || "Some error occurred while creating the Note."
    });
    });
}
