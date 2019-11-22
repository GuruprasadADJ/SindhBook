const Note = require('../models/note.model.js');


var inputemail='';
exports.sendeotp = (req, res) => {
  var inputs=req.body;
// Validate request
if(!inputs.email) {
    return res.status(400).send({
        message: "content can not be empty1"
    });
};
//generates random otp
function random(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
   return result;
  }
var otp=random(6);

Note.find({
  "email": inputs.email,
 }).then(note => {
  console.log('going',note);
  if(note.length == 0){
     flag=1;
  }else if(note.length != 0){   
      flag=0;     
        //  res.status(500).send({message: 'user already exist'});
  }
})
    //eneter
    const note=Note.updateOne(
        {_id:last_insertid},
        {profile_update_status:1},
        function(err,note) {
         if (err) return res.status(500).send("There was a problem adding the information to the database.");
         console.log("res=",note);
          //   res.status(200).send({otp_status:'1'});
        });
      
}