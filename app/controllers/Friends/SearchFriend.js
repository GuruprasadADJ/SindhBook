const Note=require('../../models/note.model.js');
const Friend=require('../../models/Friends/friends.model1.js');
const Relative=require('../../models/Relative_models/relatives.model.js')

exports.searchfriend = (req, res) => {
    var id=req.params.id;
    var data=req.params.input;
    //var  input=data.ignoreCase;
    var  input=data.replace(/\s/g, ''); //this line removes spaces in between words
    var firstword=data;
    var secondword=data;
    console.log("input",input)

    Note.findById(id)
    .then(note=>{
        if(note)
        {
            var blocked_list=[];
            function frnds_block_list(){
                Friend.find({
                    "user_id":id
                }).then(request=>{
                    if(request.length!=0)
                    {
                        blocked_list=request[0].blocked_list;
                        for(var k=0; k<request[0].blocked_by_others.length;k++){
                            blocked_list.push(request[0].blocked_by_others[i]);
                        }
                    }
                })
            }
            function relative_block_list(){
                Relative.find({
                    "user_id":id
                }).then(request1=>{
                    if(request1.length!=0)
                    {
                        for(var j=0; j<request1[0].r_blocked_list.length;j++){
                            blocked_list.push(request1[0].r_blocked_list[j]);
                        }
                      
                        for(var m=0; m<request1[0].r_blocked_by_others.length;m++){
                            blocked_list.push(request1[0].r_blocked_by_others[m]);
                        }
                    }
                })
            }

            frnds_block_list();
            relative_block_list();

            Note.find({
                "$or": [{ "first_name":{$regex:( new RegExp("^"+input.toLowerCase(), "i"))}}, 
                        { "last_name": {$regex:( new RegExp("^"+input.toLowerCase(), "i"))}},
                        { "email":     {$regex:( new RegExp("^"+input.toLowerCase(), "i"))}},
                        {"mobile_no":  {$regex:( new RegExp("^"+input.toLowerCase(), "i"))}}
                ]
            }).then(note=>{
                if(note.length!=0){
                    var arraylist=[];
                    for(var i=0; i<note.length; i++)
                    {
                        var notedata=note[i];
                        console.log("notedata.id",notedata.id);
                        if(blocked_list.includes(notedata.id))
                        {

                        }
                        else
                        {
                            if(note[i].id!=id)
                            {
                                var json={};
                                json["id"]=note[i].id;
                                json["user_name"]=note[i].first_name+" "+note[i].last_name;
                                json["profile_picture"]=note[i].profile_picture;
                                arraylist.push(json);
                            }
                        }
                    }
                    res.status(200).send({result:"success",message:"found",data:arraylist});
                }
            })
        }
        else
        {   
            res.status(200).send({result:"failed",message:"Thos user not found in register table"});
        }
    })

    
}