module.exports = (app) => {
    const notes = require('../controllers/register.js');
    const login = require('../controllers/login_api.js');
    const resend = require('../controllers/resend_mobile_otp.js');
    const verifymobileotp = require('../controllers/verify_mobile_otp.api.js');
    const about = require('../controllers/about.js');
    const privacy = require('../controllers/privacy_setting.js');

    const post=require('../controllers/post_content.js');  //""
    let upload = require('../config/multer.config.js');    //""

    const Friends=require('../controllers/friends.js');

    // register user update profile api
    app.post('/register', notes.create);
    app.put('/update',notes.update);

    //login user
    app.post('/login', login.Authenticate);

    //resend otp
    app.post('/resendotp',resend.create1);

    //verifiying mobile otp 
    app.post('/verifymobileotp',verifymobileotp.verifyotp);

     //about api creating
     app.post('/createAboutDetails',about.createabout);
     app.get('/showAboutDetails/:about1Id',about.showaboutdetails);
 
     //privacy  api
     app.post('/createPrivacyDetails',privacy.createprivacy);
     app.get('/showPrivacyDetails/:privacyId',privacy.showPrivacyDetails);

    //CREATE POST AND UPDATE POST
    app.post('/createOnePost', upload.array("file"), post.createPost);
    app.post('/UpdateOnePost', upload.array("file"), post.updatePost);

    //SEND FRIEND REQUESTAND ACEPT
    app.post('/sendFriendRequest',Friends.friendrequest);
    app.post('/acceptFriendRequest',Friends.answerrequest);
   
}