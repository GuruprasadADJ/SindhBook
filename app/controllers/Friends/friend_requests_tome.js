const Friends=require('../../models/friends.model.js');
const Note = require('../../models/note.model.js');

exports.myrequests = (req, res) => {
console.log("start.....myrequests")
    var _id=req.params.noteId;
    var list=[];
    var arraylist=[];
   
        Friends.find({
            "to_id": _id,
            "status":1
        }).then(frndlist=>{
            var request_ids=[];
            for(var i=0;i<frndlist.length;i++)
            {
                request_ids.push(frndlist[i].from_id)
            }
            showdata(request_ids);
            //res.status(200).send({reslut:'sucess',message:'data found successfully',data:request_ids});
        }).catch(err => {
            res.status(500).send({result:"failed",message:"There was an exception",errorMessage: err.message});
        });
   
    function showdata(request_ids)
    {
        Note.find({
            "_id":{"$in" :  request_ids }
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
                res.send({result:"success",message:"My friend request list found successfully",data:arraylist});
            }
            else{
                res.send({result:"success",message:"No friend requests found",data:arraylist});
            }
        }).catch(err => {
            res.status(500).send({result:"failed",message:"There is an exception",errorMessage: err.message });
        });
    }
}