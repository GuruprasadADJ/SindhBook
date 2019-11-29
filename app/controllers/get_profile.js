const Post=require('../models/post.model.js');
const Note=require('../models/note.model.js');
const Friend=require('../models/friends.model.js');
const Privacy=require('../models/privacy.model.js');
const About=require('../models/aboutus.model.js');

/*NOTE*/
//call backs and function responses did not used here
exports.getProfileDetails = (req, res) => {
    var arraylist=[];
    var arraylist_about=[];
    var user_id=req.params.user_id;
    var friend_id=req.params.friend_id;
    var f_status=0;
    var p_status=0;
    var p_about_status=0;
    var show_data=0;
    var show_data_about=0;
    var profile_picture='';
    Note.find({
        "_id":  {
            "$in": [user_id, friend_id]
        }
    }).then(note=>{
        if(note.length!=2){
            return res.status(200).send({result:'success',
                message: "Data not found in database with this user id or friend id "
            });
        }
        else
        {
            profile_picture=note[0].profile_picture;
            var name=note[0].first_name+" "+note[0].last_name;
            console.log("Test1");
            find_friend_status(user_id,friend_id,function(response){
                //f_status=response;
                console.log("f_status",f_status); 
                //check privacy status for post
                find_privacy_status(friend_id,function(response){
                   // p_status=response.status1;
                    console.log("p_status",p_status);
                    //check privacy status for about
                    find_privacy_status1(friend_id,function(response){
                        // p_about_status=response.status2;
                        console.log("p_about_status",p_about_status);
                        show_result(p_status,f_status,name,profile_picture);
                    });
                });              
            });  
        }
    }).catch(err => {
        return res.status(200).send({result:'failed',
                message: "There is an exception ",errorMessage:err.message});
    })
//this function find status whether the user friend or not
    function find_friend_status(user_id,friend_id,callback)
    {
        console.log("Test2");
        var status=0;
        Friend.find({
            "from_id": user_id,
            "to_id": friend_id
        }).then(friend1=>{
            if(!friend1.length==0){
                status=friend1[0].status;
                f_status=friend1[0].status;
                return callback(status);
            }
            else{
                Friend.find({
                    "from_id": friend_id,
                    "to_id": user_id
                }).then(friend2=>{
                    if(!friend2.length==0){
                        status=friend2[0].status;
                        f_status=friend1[0].status;
                        return callback(status);
                    }
                    else
                    {
                        return callback(status);
                    }
                }).catch(err => {
                    res.status(500).send({
                      result:"failed",message:"There was an exception",errorMessage: err.message || "Some error occurred while creating the Note."
                    });
                });
            }
        }).catch(err => {
            res.status(500).send({
              result:"failed",message:"There was an exception",errorMessage: err.message || "Some error occurred while creating the Note."
        });
        });
    }
//find privacy of post     
    function find_privacy_status(friend_id,callback)
    {
        console.log("Test3.p");
        var status1=0;
        Privacy.find({
            "user_id": friend_id
        }).then(result=>{
            if(!result.length==0){
                status1=result[0].post;
                p_status=result[0].post;
                return callback(status1);
            }
            else{
                return callback(status1);
                
            }
            }).catch(err => {
                res.status(500).send({
                result:"failed",message:"There was an exception",errorMessage: err.message || "Some error occurred while creating the Note."
            });
            });
    }
//find privacy of about
    function find_privacy_status1(friend_id,callback)
    {
        console.log("Test3.a");
        var status2=0;
        Privacy.find({
            "user_id": friend_id
        }).then(result=>{
            if(!result.length==0){
                status2=result[0].about;
                p_about_status=result[0].about;
                return callback(status2);
            }
            else{
                return callback(status2);
            }
            }).catch(err => {
                res.status(500).send({
                result:"failed",message:"There was an exception",errorMessage: err.message || "Some error occurred while creating the Note."
            });
            });
    }

//show result function for post details
    function show_result(p_status,f_status,name,profile_picture)
    {
        var data={};
        console.log(p_status+" "+f_status);
        if(p_status==1)
        {
             show_data=0;
        }
        else if(p_status==3)
        {
             show_data=1;
        }
        else if(p_status==2)
        {
            if(f_status==2)
            {
                show_data=1;
            }
            else
            {
                show_data=0;
            }
        }
        else
        {
              show_data=1;
        }
        if(show_data==0)
        {
            data["user_name"]=name;
            data["profile_picture"]=profile_picture;
            data["Post_Details"]=arraylist;
            show_result_about(p_about_status,f_status,name,profile_picture);
         }
        else
        {
            Post.find({ 
                "user_id":{"$in" : friend_id }
            }).then(post=>{
                console.log("filling data");
                for(var i=0;i<post.length;i++){
                var json={};
                json["title"]=post[i].title;
                json["content"]=post[i].content;
                json["images"]=post[i].images;
                json["likes"]=post[i].like;
                json["comments"]=post[i].comment;
                json["created_at"]=post[i].created_at;
                json["name"]=name;
                arraylist.push(json); 
            }
            show_result_about(p_about_status,f_status,name,profile_picture);
                // data["user_name"]=name;
                // data["profile_picture"]=profile_picture;
                // data["Post_Details"]=arraylist;
                // return res.status(200).send({result:'success',
                // message: "User Profile Details",data});
            }).catch(err => {
                 return res.status(200).send({result:'failed',
                 message: "There is an exception ",errorMessage:err.message});
            })
        } 
    }  
//show result function for about details
    function show_result_about(p_about_status,f_status,name,profile_picture)
    {
        var data={};
        console.log(p_about_status+" "+f_status);
        if(p_about_status==1)
        {
            show_data_about=0;
        }
        else if(p_about_status==3)
        {
            show_data_about=1;
        }
        else if(p_about_status==2)
        {
            if(f_status==2)
            {
                show_data_about=1;
            }
            else
            {
                show_data_about=0;
            }
        }
        else
        {
            show_data_about=1;
        }
        console.log("show_data_about : ",show_data_about);
        if(show_data_about==0)
        {
            data["user_name"]=name;
            data["profile_picture"]=profile_picture;
            data["Post_details"]=arraylist;
            data["About_details"]=arraylist_about;
            console.log("third");
            return res.status(200).send({result:'success',message: "User Profile Details",data:data});
        }
        else
        {
            About.find({ 
                "user_id": friend_id
            }).then(about_result=>{
                for(var i=0;i<about_result.length;i++)
                {
                    console.log("first");
                    var json={};
                    var W=about_result[i].work.length-1; 
                    var E=about_result[i].education.length-1;
                    var P=about_result[i].places_lived.length-1; 
                    json["work"]=about_result[i].work[W];
                    json["education"]=about_result[i].education[E];
                    json["places_lived"]=about_result[i].places_lived[P];
                    json["contact_info"]=about_result[i].contact_info;
                    json["name"]=name;
                    arraylist_about.push(json); 
                }
                console.log("second");
                data["user_name"]=name;
                data["profile_picture"]=profile_picture;
                data["Post_details"]=arraylist;
                data["About_Details"]=arraylist_about;
                return res.status(200).send({result:'success',message: "User Profile Details",data:data});
            }).catch(err => {
                return res.status(200).send({result:'failed',
                message: "There is an exception ",errorMessage:err.message});
            })
        } 
    }        
}