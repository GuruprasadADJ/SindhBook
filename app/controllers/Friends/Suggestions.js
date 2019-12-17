const Note=require('../../models/note.model.js');
const Friend=require('../../models/Friends/friends.model1.js');
const Relative=require('../../models/Relative_models/relatives.model.js')
const moment = require('moment'); //to parse the default date of mongodb
const shuffle=require('shuffle-array');

exports.suggestions = (req, res) => {
    console.log("start.....suggestions")
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
              Friend.find({
                  "user_id":user_id
              }).then(request=>{ 
                if(request.length>0)
                {
                    var temp_ids=[];
                    var acc_list=request[0].accepted_list;
                    for(var i=0;i<acc_list.length;i++){
                        temp_ids.push(acc_list[i].id);
                    }
                    //to find friends of friends *temp_ids are friends of user_id
                    Friend.find({
                        "user_id":{"$in": temp_ids},
                    }).then(request11=>{
                    console.log("request11.length",request11.length)
                        if(request11.length==0){
                            all_user_list();
                        }
                        if(request11.length>1)
                        {
                            var flag=0;
                            console.log("friends  length  :",request11.length);
                            for(var j=0;j<request11.length;j++)
                            {
                                console.log("j----",j);
                                var acc_list=request11[j].accepted_list;
                                if(acc_list.length>1)
                                {
                                    for(var i=0;i<acc_list.length;i++)
                                    {
                                        if(ids.includes(acc_list[i].id))
                                        {

                                        }else{
                                            if(acc_list[i].id!=user_id){
                                                ids.push(acc_list[i].id);
                                            }   
                                        }
                                    }
                                }
                               else{
                                   flag=1;
                               }
                            }
                           if(flag==1){
                               console.log("flag");
                               all_user_list();
                           }
                            checkinfrnds();
                        }
                        if(request11.length==1)
                        {
                            console.log("this length is 1");
                            var acc_list=request11[0].accepted_list;
                            if(acc_list.length<=2)
                            {
                                all_user_list();
                            }
                            else if(acc_list.length>2)
                            {
                                for(var i=0;i<acc_list.length;i++){
                                    if(ids.includes(acc_list[i].id)){

                                    }else{
                                        if(acc_list[i].id!=user_id){
                                            ids.push(acc_list[i].id);
                                        }
                                    }
                                }
                            }
                            checkinfrnds();
                        }
                    }).catch(err => {
                        res.status(500).send({result:"failed",message:"There was an exception",errorMessage: err.message});
                    });
                }
                else
                {
                    all_user_list();
                }
            }).catch(err => {
                res.status(500).send({result:"failed",message:"There was an exception",errorMessage: err.message});
            });
           }
            function all_user_list()
            {
                Note.find()
                .then(result=>{
                for(var i=0;i<result.length;i++)
                {
                    
                    if(result[i].id==user_id)
                    {
                        console.log("all users",result[i]);
                    }
                    else
                    {
                        if(ids.includes(result[i].id)){

                        }else{
                            ids.push(result[i].id);
                        }
                    }
                    if(result.length-1==ids.length){
                        console.log("display this");
                        checkinfrnds();
                    }
                }
            })
            }

            /************************chech in frnds function***********************/
            /******************************************************************** */
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
                })
                .catch(err => {
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
    function show_list()
    {
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
        })
        .catch(err=>{res.status(500).send({result:"failed",message:"There was an exception",errorMessage: err.message})
        });
    }
})
.catch(err => {
    res.status(500).send({result:"failed",message:"There was an exception",errorMessage: err.message});
});
}


