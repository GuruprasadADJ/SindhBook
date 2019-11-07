const Note = require('../models/note.model.js');
var qs = require("querystring");
var http = require("http");
var data='';
var verify='';
//------------------resend otp--------------------------
exports.create1= (req, res) =>{
    //validate input data
    data=req.body.mobile_no;
   if(!data) {
       return res.status(200).send({
        result:"failed",message: "Mobile content can not be empty"
       });
   }

   //generates random otp
   console.log('generating otp');
   function random(length) {
       var result           = '';
       var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
       var charactersLength = characters.length;
       for ( var i = 0; i < length; i++ ) {
           result += characters.charAt(Math.floor(Math.random() * charactersLength));
       }
      return result;
     }
     var sotp=random(6);
   //</generates random otp>
    
   //send otp sms
   console.log('sending');
   var options = {
       "method": "GET",
       "hostname": "2factor.in",
       "port": null,
       "path": "/API/V1/76263c6b-fc6d-11e9-9fa5-0200cd936042/SMS/"+data+"/"+random(6)+"",
       "headers": {
         "content-type": "application/x-www-form-urlencoded"
       }
     };
     
     var req = http.request(options, function (res) {
       var chunks = [];
     
       res.on("data", function (chunk) {
         chunks.push(chunk);
       });
     
       res.on("end", function () {
         var body = Buffer.concat(chunks);
         console.log(body.toString());
       });
     });
     
     req.write(qs.stringify({}));
     req.end();
   //</send otp sms>


   const note=Note.update(
       {mobile_no:data},
       {otp:sotp},
       function(err,note) {
        if (err) return res.status(500).send({result:"failed",message:"Mobile Number not found"});
        console.log("res=",note);
            res.status(200).send({result:"success",message:"Otp resend",otp:sotp});
       });
};