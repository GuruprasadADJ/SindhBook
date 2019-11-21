const Friends=require('../models/friends.model.js');
const Note = require('../models/note.model.js');

exports.friends_list = (req, res) => {
    var inputs=req.body;
    var _id=inputs.id;
    var list=[];
    var arraylist=[];
    if(!_id){
        res.status(200).send({reslut:'failed',message:'id is required'});
    }
    else
    {
        Note.find({          //checks weather the user_id exist in register table or not
            "_id": _id
        }).then(note=>{
            if(!note.length==0)
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
                                    //res.status(200).send({result:"success",message:"Friend List Data",Data: list});
                                }                    
                                else{
                                    showdata(list);
                                    //res.status(200).send({result:"success",message:"Friend List Data",Data: list});
                                }
                                }).catch(err => {
                                    res.status(500).send({
                                        result:"failed",message:"Not Registered",errorMessage: err.message || "Some error occurred while creating the Note."
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
                                    //res.status(200).send({result:"success",message:"Friend List Data",Data: list});
                                }else{
                                    res.status(200).send({result:"failed",message:"No Friend List Found"});
                                }                    
                                }).catch(err => {
                                    res.status(500).send({
                                        result:"failed",message:"Not Registered",errorMessage: err.message || "Some error occurred while creating the Note."
                                    });
                                });
                        }                
                    }).catch(err => {
                        res.status(500).send({
                            result:"failed",message:"Not Registered",errorMessage: err.message || "Some error occurred while creating the Note."
                        });
                    });
                    
            }
            else{
                res.status(200).send({result:"failed",message:"user not found with this id in registers"});
            }
        }).catch(err => {
            res.status(500).send({
                result:"failed",message:"Not Registered",errorMessage: err.message || "Some error occurred while creating the Note."
            });
        });        
    }
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
                    json["first_name"]=result[i].first_name;
                    json["last_name"]=result[i].last_name;     
                    arraylist.push(json);
                }
                res.send({result:"success",message:"ok",data:arraylist});
            }
            else{
                //return res.status(200).send({result:'failed',message: "result is equal to zero" });
            }
        })
    }
}