const Note=require('../../models/note.model.js');
const Friend=require('../../models/Friends/friends.model1.js');
const Relative=require('../../models/Relative_models/relatives.model.js')
const moment = require('moment'); //to parse the default date of mongodb
const shuffle=require('shuffle-array');

exports.GetAllUsersList = (req, res) => {
    console.log("start.....GetAllUsersList")
    var inputs=req.params;
    var user_id=inputs.userId;
    var ids=[];
    var data=[];
   
    Note.find({
        "_id": user_id
    }).then(note=>{
       if(note.length!=0)
       {   
            findids();
           //retrive all users to ids    
           function findids()
           {
                Note.find()
                .then(result=>{
                    lengtr=result.length;
                    for(var i=0;i<result.length;i++)
                    {
                        if(result[i].id==user_id)
                        {
                            console.log("all users",result[i]);
                        }
                        else
                        {
                        ids.push(result[i].id);
                        }
                        if(result.length-1==ids.length){
                            console.log("display this");
                            checkinfrnds();
                        }
                    }
                }).catch(err => {
                    res.status(500).send({result:"failed",message:"There was an exception",errorMessage: err.message});
                });
            }
            //chech in frnds function
            function checkinfrnds()
            {
                /*******CHECKING IN FRIENDS TABLE */
                console.log("second_function_call")
                Friend.find({
                    "user_id":user_id
                }).then(request=>{       
                    console.log("opening friends list");
                    if(request.length==0)
                    {
                        console.log("no data in frnds")
                        three();
                    }
                    else
                    {
                        console.log("og");
                        var requested_list=[],requested_by_me=[],accepted_list=[],blocked_list=[];
                        requested_list=request[0].requested_list;
                        requested_by_me=request[0].requested_by_me;
                        console.log("requested_by_me",requested_by_me);
                        accepted_list=request[0].accepted_list;
                        blocked_list=request[0].blocked_list;
                        for(var i=0;i<requested_by_me.length;i++)
                        {
                            if(ids.includes(requested_by_me[i].id))
                            {
                                var index = ids.indexOf(requested_by_me[i].id);
                                ids.splice(index, 1);
                            }
                        }
                        for(var i=0;i<requested_list.length;i++)
                        {
                            if(ids.includes(requested_list[i].id))
                            {
                                var index = ids.indexOf(requested_list[i].id);
                                ids.splice(index, 1);
                            }
                        }
                        for(var i=0;i<accepted_list.length;i++)
                        {
                            if(ids.includes(accepted_list[i].id))
                            {
                                var index = ids.indexOf(accepted_list[i].id);
                                ids.splice(index, 1);
                            }
                        }
                        for(var i=0;i<blocked_list.length;i++)
                        {
                            if(ids.includes(blocked_list[i].id))
                            {
                                var index = ids.indexOf(blocked_list[i].id);
                                ids.splice(index, 1);
                            }
                        }
                        three();
                    }
                }).catch(err => {
                    res.status(500).send({result:"failed",message:"There was an exception",errorMessage: err.message});
                });


                //*******SPLICES THE ID from ids list IF IT EXIST IN RELATIVES LIST */
                function three(){
                    console.log("function three executing");
                Relative.find({
                    "user_id":user_id
                }).then(result=>{       
                    if(result.length!=0)
                    {
                        var i;
                        var j;
                        var accepted_list=result[0].r_accepted_list;
                        for(i=0;i<accepted_list.length;i++){
                            console.log(" 1 ");
                            if(ids.includes(accepted_list[i].id)){
                                console.log(" 2 ");
                                for(j=0;j<ids.length;j++){
                                    console.log("......",ids[j],".....",accepted_list[i].id);
                                    //console.log(" 3 ",accepted_list[i].id);
                                    if(ids[j]==accepted_list[i].id){
                                        console.log(" 4 ",ids[j]);
                                        ids.splice(j,1);
                                    }
                                }
                            }
                        }
                        show_list();
                    }
                    else{
                        show_list();
                    }
                })
            }
        }
    }
    else
    {
        return res.status(200).send({result:"success",message:"User id not found in register table"}); 
    }


    //display all final users
    function show_list(){
        console.log("third_function_call")
        Note.find({
            "_id":  {"$in": ids},
            "profile_update_status":1
        }).then(note1=>{
            console.log("count of final list : ",note1.length)
            if(note1.length==0)
            { 
                console.log("no frnds");
                return res.status(200).send({result:"success",message:"No friends list found",data:[]}); 
            } 
            else
            {
                for(var i=0;i<note1.length;i++)
                {                     
                    var json={};
                    json["id"]=note1[i].id;
                    json["user_name"]=note1[i].first_name+" "+note1[i].last_name;
                    json["profile_picture"]=note1[i].profile_picture;
                    data.push(json);
                }
                if(note1.length==data.length)
                {
                    console.log("no of users diplaying : ",data.length);
                    data=shuffle(data);
                    return res.status(200).send({result:"success",message:"Showing all users List",data:data}); 
                }
            }
        }).catch(err=>{res.status(500).send({result:"failed",message:"There was an exception",errorMessage: err.message})
        });
    }
}).catch(err => {
    res.status(500).send({
      result:"failed",message:"There was an exception",errorMessage: err.message || "Some error occurred while creating the Note."
});
});
}