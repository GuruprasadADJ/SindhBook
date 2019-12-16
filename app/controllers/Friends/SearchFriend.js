const Note=require('../../models/note.model.js');
const Friend=require('../../models/Friends/friends.model1.js');
const Relative=require('../../models/Relative_models/relatives.model.js')

exports.searchfriend = (req, res) => {
    var data=req.params.input;
    //var  input=data.ignoreCase;
    var  input=data;
    console.log("input",input)
    Note.find({
        // "$or": [{
        //     "mobile_no": "%88%"
        // }, {
        //     "name": "sm%"
        // }, {
        //     "email": "smita.ad%"
        // }]
        "$or": [//{ "first_name":{$regex:( new RegExp("^"+input))}}, 
                { "last_name": {$regex: new RegExp("^"+input)}},
                { "email":  {$regex: new RegExp("^"+input)}}
        ]
    }).then(note=>{
      
            res.status(200).send({result:"success",message:"found",data:note});
       
    }).catch(err => {
        res.status(500).send({result:"failed",message:"There was an exception",errorMessage: err.message});
    });
}