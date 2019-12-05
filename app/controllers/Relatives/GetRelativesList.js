const Note=require('../../models/note.model.js');
const Relative=require('../../models/Relative_models/relatives.model.js');

exports.GetRelativesList = (req, res) => {
    var id=req.params.noteId;

    Note.findById(id)
    .then(note=>{
       if(note)
       {
            Relative.find({"user_id":id})
            .then(request=>{
                if(request.length!=0){
                    var data=[];
                    data=request[0].r_accepted_list;
                    console.log("data : ",data);
                    res.status(200).send({result:"success",message:"Showing relatives list",data:data});
                }
                else{
                    res.status(200).send({result:"success",message:"No relatives list found",data:data});
                }
                

            }).catch(err => {
                res.status(500).send({result:"failed",message:"There was an exception3",errorMessage: err.message });
            });
       }
       else{
          res.status(200).send({result:"success",message:"This does not exist in register table id:",id});
       }
    }).catch(err => {
        res.status(500).send({ result:"failed",message:"There was an exception3",errorMessage: err.message  });
    });
           
    

}