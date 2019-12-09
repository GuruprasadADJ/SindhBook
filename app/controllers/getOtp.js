const Note = require('../models/note.model.js');
var qs = require("querystring");
var http = require("http");
var data='';
var verify='';
//------------------resend otp--------------------------
exports.getOtp= (req, res) =>{

  var  _id=req.body.id;
  var mobile_no=req.body.mobile_no;
   if(!_id && !mobile_no) {
       return res.status(200).send({
        result:"failed",message: "Please enter id and mobile_no"
       });
   }
   else
   {  
      Note.find({
        "_id":_id
      }).then(result => {
         if(result.length==0)
         {
           res.status(200).send({result:"success",message:"The entered id related record not found"});
        }
        else
        {
          Note.find({
            "mobile_no": mobile_no,
          }).then(result => {
             if(result.length==0)
             {
                //var sotp=random(6);
                var sotp='123456';
                const note=Note.update(
                    {_id:_id},
                    { otp:sotp, 
                      mobile_no:mobile_no,
                      otp_status:0
                    },
                    function(err,note) {
                     if (err) return res.status(500).send({result:"failed",message:"There is an error while inserting data",errorMessage:err.message});
                     //console.log("res=",note);
             
                     //  //send otp sms
                          console.log('otp sending');
                     //     var options = {
                     //     "method": "GET",
                     //     "hostname": "2factor.in",
                     //     "port": null,
                     //     "path": "/API/V1/76263c6b-fc6d-11e9-9fa5-0200cd936042/SMS/"+data1+"/"+random(6)+" ",
                     //     "headers": {
                     //       "content-type": "application/x-www-form-urlencoded"
                     //      }
                     //    };
                       
                     //     var req = http.request(options, function (res) {
                     //     var chunks = [];
                       
                     //     res.on("data", function (chunk) {
                     //       chunks.push(chunk);
                     //     });
                       
                     //     res.on("end", function () {
                     //       var body = Buffer.concat(chunks);
                     //       console.log(body.toString());
                     //      });
                     //    });
                       
                     //    req.write(qs.stringify({}));
                     //    req.end();
                     // //</send otp sms>
                         res.status(200).send({result:"success",message:"Otp sent successfully",otp:sotp});
                    });
           }
            else
            {
                if(result[0]._id==_id)
                {
                  //var sotp=random(6);
                  var sotp='123456';
                  const note=Note.update(
                    {_id:_id},
                    { otp:sotp, 
                      mobile_no:mobile_no,
                      otp_status:0
                    },
                    function(err,note) {
                     if (err) return res.status(500).send({result:"failed",message:"There is an error while inserting data",errorMessage:err.message});
                     //console.log("res=",note);
             
                     //  //send otp sms
                          console.log('otp sending');
                     //     var options = {
                     //     "method": "GET",
                     //     "hostname": "2factor.in",
                     //     "port": null,
                     //     "path": "/API/V1/76263c6b-fc6d-11e9-9fa5-0200cd936042/SMS/"+data1+"/"+random(6)+" ",
                     //     "headers": {
                     //       "content-type": "application/x-www-form-urlencoded"
                     //      }
                     //    };
                       
                     //     var req = http.request(options, function (res) {
                     //     var chunks = [];
                       
                     //     res.on("data", function (chunk) {
                     //       chunks.push(chunk);
                     //     });
                       
                     //     res.on("end", function () {
                     //       var body = Buffer.concat(chunks);
                     //       console.log(body.toString());
                     //      });
                     //    });
                       
                     //    req.write(qs.stringify({}));
                     //    req.end();
                     // //</send otp sms>
                         res.status(200).send({result:"success",message:"Otp sent successfully",otp:sotp});
                    });
                }
                else
                {
                  res.status(200).send({result:"success",message:"The entered mobile number is already exist, please login with mobile number. or try with other number"});
                }  
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
};
//------------------------------------------------------------------------------------------------
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
  //</generates random otp>

  //------------------------------------------------------------------------------------------------------

 