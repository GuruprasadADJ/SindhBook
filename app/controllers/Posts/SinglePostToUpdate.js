const Post1=require('../../models/post.model.js');
const Note=require('../../models/note.model.js');
exports.getPostDetails = (req, res) => {
    var id=req.params.id;
    Post1.findById(id)
    .then(data=>{   
        if(data!=0){
            
            Note.find({
                "_id":data.user_id
            }).then(data1=>{
                var user_name=data1[0].first_name+" "+data1[0].last_name;
                var json={};
                json["id"]=data.id;
                json["user_id"]=data.user_id;
                json["title"]=data.title;
                json["content"]=data.content;
                json["user_name"]=user_name;
                res.status(200).send({result:"success",message:"Displaying post data to edit",data:json});
            }).catch(err => {
                res.status(500).send({result:"failed",message:"There was an exception",errorMessage: err.message});
              });
        }
    }).catch(err => {
        res.status(500).send({result:"failed",message:"There was an exception",errorMessage: err.message});
      });
}
