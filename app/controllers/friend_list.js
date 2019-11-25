const Friends=require('../models/friends.model.js');
const Note = require('../models/note.model.js');

exports.friends_list = (req, res) => {
    var _id=req.params.noteId;
    var list=[];
    var arraylist=[];
   
        Note.findById(req.params.noteId)
        .then(note=>{
            console.log(note);
            if(note)
            {
                    Friends.find({
                        "from_id": _id,
                        "status":2
                    }).then(frndlist=>{
                        if(!frndlist.length==0){
                            var toids;
                            for(var i=0;i<frndlist.length;i++){
                                toids=frndlist[i].to_id;
                                if(!list.includes(toids)){
                                    list.push(toids);
                                }
                            }
                            Friends.find({
                                "to_id": _id,
                                "status":2
                            }).then(frndlist1=>{
                                if(!frndlist1.length==0){
                                    var fromids;
                                    for(var i=0;i<frndlist1.length;i++){
                                        fromids=frndlist1[i].from_id;
                                        if(!list.includes(fromids)){
                                            list.push(fromids);
                                        }
                                    }
                                    showdata(list);
                                }                    
                                else{
                                    showdata(list);
                                }
                                }).catch(err => {
                                    res.status(500).send({
                                        result:"failed",message:"There was an exception",errorMessage: err.message || "Some error occurred while creating the Note."
                                    });
                                });
                        }else{
                            Friends.find({
                                "to_id": _id,
                                "status":2
                            }).then(frndlist1=>{
                                if(!frndlist1.length==0){
                                    var fromids;
                                    for(var i=0;i<frndlist1.length;i++){
                                        fromids=frndlist1[i].from_id;
                                        if(!list.includes(fromids)){
                                            list.push(fromids);
                                        }
                                    }
                                    showdata(list);
                                }else{
                                    res.status(200).send({result:"success",message:"No friend list found",data:frndlist1});
                                }                    
                                }).catch(err => {
                                    res.status(500).send({
                                        result:"failed",message:"There was an exception",errorMessage: err.message || "Some error occurred while creating the Note."
                                    });
                                });
                        }                
                    }).catch(err => {
                        res.status(500).send({
                            result:"failed",message:"There was an exception",errorMessage: err.message || "Some error occurred while creating the Note."
                        });
                    });
                    
            }
            else{
                res.status(200).send({result:"success",message:"User not found in database with this id "+ _id});
            }
        }).catch(err => {
            res.status(500).send({
                result:"failed",message:"There was an exception",errorMessage: err.message || "Some error occurred while creating the Note."
            });
        });        
   //==============================
    function showdata(ids)
    {
        Note.find({
            "_id":{"$in" :  ids }
        })
        .then(result=>{
            if(!result.length==0){
                console.log(result.length-1)
                for(var i=0;i<result.length;i++){
                    var json={};
                    json["id"]=result[i].id;
                    json["name"]=result[i].first_name+" "+result[i].last_name;   
                    json["profile_picture"]=result[i].profile_picture;     
                    arraylist.push(json);
                }
                res.send({result:"success",message:"Friend list found successfully",data:arraylist});
            }
            else{
                res.send({result:"success",message:"No friend list found",data:arraylist});
            }
        })
    }
}