
const Note=require('../../models/note.model.js');
const Relative=require('../../models/Relative_models/relatives.model.js');
const moment = require('moment'); //to parse the default date of mongodb

exports.GetAllRelativesList = (req, res) => {
    console.log("start.....")
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
               console.log("first_function_run");
                Note.find()
                .then(result=>{
                    lengtr=result.length;
                    for(var i=0;i<result.length;i++)
                    {
                        if(result[i].id==user_id)
                        {
                            console.log("all relatives",result[i]);
                        }
                        else
                        {
                            ids.push(result[i].id);
                        }
                        if(result.length-1==ids.length){
                            console.log("display this");
                            checkinrelatives();
                        }
                    }
                }).catch(err => {
                    res.status(500).send({result:"failed",message:"There was an exception",errorMessage: err.message});
                });
            }
        
            //chech in frnds function
            function checkinrelatives()
            {
                console.log("second_function_call")
                Relative.find({
                    "user_id":user_id
                }).then(request=>{       
                    console.log("opening relatives list");
                    if(request.length==0)
                    {
                        console.log("no data in relatives")
                        show_list();
                    }
                    else
                    {
                        console.log("og");
                        var requested_list=[],requested_by_me=[],accepted_list=[],blocked_list=[];
                        requested_list=request[0].r_requested_list;
                        requested_by_me=request[0].r_requested_by_me;
                        console.log("requested_by_me",requested_by_me);
                        accepted_list=request[0].r_accepted_list;
                        blocked_list=request[0].r_blocked_list;
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
                        show_list();
                    }
                }).catch(err => {
                    res.status(500).send({result:"failed",message:"There was an exception",errorMessage: err.message});
                });
            }
    }
    else
    {
        return res.status(200).send({result:"success",message:"User id not found in database"}); 
    }


    //display all final users
    function show_list(){
        console.log("third_function_call")
        Note.find({
            "_id":  {"$in": ids}
        }).then(note1=>{
            console.log("count of final list : ",note1.length)
            if(note1.length==0)
            { 
                console.log("no relatives");
                return res.status(200).send({result:"success",message:"No friends list found",data:[]}); 
            } 
            else
            {
                for(var i=0;i<note1.length;i++)
                {                     
                    var json={};
                    var gender=0;
                    if(note1[i].gender==1){
                        gender="male";
                    }else if(note1[i].gender==2){
                        gender="female";
                    }
                    json["id"]=note1[i].id;
                    json["user_name"]=note1[i].first_name+" "+note1[i].last_name;
                    json["profile_picture"]=note1[i].profile_picture;
                    json["gender"]=gender;
                    data.push(json);
                }
                if(note1.length==data.length)
                {
                    console.log("no of relatives diplaying : ",data.length);
                    return res.status(200).send({result:"success",message:"All Relatives List",data:data}); 
                }
            }
        }).catch(err=>{res.status(500).send({result:"failed",message:"There was an exception",errorMessage: err.message})
        });
    }
}).catch(err => {
    res.status(500).send({result:"failed",message:"There was an exception",errorMessage: err.message});
});
}