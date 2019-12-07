const Post=require('../../models/post.model.js');
const Note=require('../../models/note.model.js');

exports.LikePost = (req, res) => {
var post_id=req.body.post_id;
var user_id=req.body.user_id;
if(post_id)
{   
    if(!user_id){
        res.status(200).send({result:"success",message:"Please enter user_id"});
    }

    Note.find({

    }).then(data=>{
        if(data.length!=0)
        {
            var json={};
            json=["user_name"]=data[0].first_name+" "+data[0].last_name;
        }
        else{
            res.status(200).send({result:"success",message:"data not exit in register table"});
        }
    })


    
}
else{
    res.status(200).send({result:"success",message:"Please enter id"});
}
}
