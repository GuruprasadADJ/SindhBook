const Note=require('../../models/note.model.js');
const Friend=require('../../models/Friends/friends.model1.js');

exports.GetFriendsList1 = (req, res) => {
    var id=req.params.noteId;

    Note.findById(id)
    .then(note=>{
       if(note)
       {
            Friend.find({"user_id":id})
            .then(request=>{
                if(request.length!=0){
                    var data=[];
                    data=request[0].accepted_list;
                    console.log("data : ",data);
                    res.status(200).send({result:"success",message:"Showing friends list",data:data});
                }
                else{
                    res.status(200).send({result:"success",message:"No friends list found",data:data});
                }
                

            }).catch(err => {
                res.status(500).send({
                result:"failed",message:"There was an exception3",errorMessage: err.message || "Some error occurred while creating the Note."
            });
            });
       }
       else{
          res.status(200).send({result:"success",message:"This does not exist in register table id:",id});
       }
    }).catch(err => {
        res.status(500).send({result:"failed",message:"There was an exception3",errorMessage: err.message});
    });
           
    

}