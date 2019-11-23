const Note = require('../models/note.model.js');

exports.registersfindAll = (req, res) => {
    var arraylist=[];
    Note.find()
    .then(result=>{
        if(!result.length==0){
            console.log(result.length-1)
           
            for(var i=0;i<result.length;i++){
                var json={};
                json["id"]=result[i].id;
                json["first_name"]=result[i].first_name;
                json["last_name"]=result[i].last_name;  
                json["profile_picture"]=result[i].profile_picture;   
                arraylist.push(json);
            }
            res.send({result:"success",message:"Users list found successfully",data:arraylist});
        }
        else{
            res.send({result:"failed",message:"Data not found in database"});
        }
    }).catch(err => {
        res.status(500).send({
            result:"Failed",message:"There was an exception",errorMessage: err.message || "Some error occurred while creating the Note."
        });
    }); 
};