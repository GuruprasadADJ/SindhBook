const Note = require('../models/note.model.js');
const Friends = require('../models/friends.model');

exports.registersfindAll = (req, res) => {
    var id=req.params.Id;
    var arraylist=[];
    var final_list=[];
    var all_ids=[];
    var user_ids=[];
    var user_status=[];
    Note.find({"profile_update_status":1})
    .then(result=>{
        if(!result.length==0){
            console.log(result.length-1)
           
            for(var i=0;i<result.length;i++){
                if(result[i].id!=id){
                     all_ids.push(result[i].id);
                }
            }
            one();
        }
        else{
            res.send({result:"success",message:"Data not found in database",data:arraylist});
        }
    }).catch(err => {
        res.status(500).send({
            result:"Failed",message:"There was an exception",errorMessage: err.message || "Some error occurred while creating the Note."
        });
    }); 
    function one()
    {
        Friends.find({
            "from_id": id
        }).then(frndlist=>{
            if(!frndlist.length==0){
                var toids;
                var status;
                console.log("Test");
                for(var i=0;i<frndlist.length;i++){
                    toids=frndlist[i].to_id;
                    status=frndlist[i].status;
                    user_ids.push(toids);
                    user_status.push(status);
                }
                two();
            }
            else
            {
                two();
            }                
        }).catch(err => {
            res.status(500).send({
                result:"failed",message:"There was an exception",errorMessage: err.message || "Some error occurred while creating the Note."
            });
        });
    }
    function two()
    {
        Friends.find({
            "to_id": id
        }).then(frndlist1=>{
            if(!frndlist1.length==0){
                var fromids;
                var status;
                console.log("Test1");
                for(var i=0;i<frndlist1.length;i++){
                    fromids=frndlist1[i].from_id;
                    status=frndlist1[i].status;
                    user_ids.push(fromids);
                    user_status.push(status);
                }
                forloop();               
            }
            else{
                forloop();
            }                     
            }).catch(err => {
                res.status(500).send({
                    result:"failed",message:"There was an exception",errorMessage: err.message || "Some error occurred while creating the Note."
                });
            });
    }
        function forloop()
        {            
            console.log("Test3");
            for(var i=0;i<all_ids.length;i++)
            {
                if(!user_ids.includes(all_ids[i]))
                {
                    final_list.push(all_ids[i]);
                }
                else{
                    var a = user_ids.indexOf(all_ids[i]);
                    var s=user_status[a];
                    if(s==3)
                    {
                        final_list.push(all_ids[i]);
                    }
                }
            }            
            showdata(final_list);
        }
        function showdata(ids)
        {
            console.log("Test4");
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
                    res.send({result:"success",message:"Users list found successfully",data:arraylist});
                }
                else{
                    res.send({result:"success",message:"No Users list found",data:arraylist});
                }
            })
        }    
    
}


/*
const Note = require('../models/note.model.js');

exports.registersfindAll = (req, res) => {
    var id=req.params.Id;
    var arraylist=[];
    Note.find({"profile_update_status":1})
    .then(result=>{
        if(!result.length==0){
            console.log(result.length-1)
           
            for(var i=0;i<result.length;i++){
                if(result[i].id!=id){
                    var json={};
                    json["id"]=result[i].id;
                    json["name"]=result[i].first_name+" "+result[i].last_name; 
                    json["profile_picture"]=result[i].profile_picture;   
                    arraylist.push(json);
                }
            }
            res.send({result:"success",message:"Users list found successfully",data:arraylist});
        }
        else{
            res.send({result:"success",message:"Data not found in database",data:arraylist});
        }
    }).catch(err => {
        res.status(500).send({
            result:"Failed",message:"There was an exception",errorMessage: err.message || "Some error occurred while creating the Note."
        });
    }); 
}*/
