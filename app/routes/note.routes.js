module.exports = (app) => {

    // register user update profile api
    const notes = require('../controllers/register.js');
    app.post('/register', notes.create);
    app.put('/update',notes.update);

    //all users list
    const allusers=require('../controllers/all_users_list.js')
    app.get('/allUsersList/:Id', allusers.registersfindAll);

    //login user
    const login = require('../controllers/login_api.js');
    app.post('/login', login.Authenticate);

    //resend otp
    const resend = require('../controllers/resend_mobile_otp.js');
    const getotp = require('../controllers/getOtp.js');
    app.post('/resendOtp',resend.create1);
    app.post('/getOtp',getotp.getOtp);
    
    //verifiying mobile otp 
    const verifymobileotp = require('../controllers/verify_mobile_otp.api.js');
    app.post('/verifymobileotp',verifymobileotp.verifyotp);

     //about api creating
     const about = require('../controllers/about.js');
     app.post('/createAboutDetails',about.createabout);
     app.get('/showAboutDetails/:about1Id',about.showaboutdetails);
 
     //privacy  api
     const privacy = require('../controllers/privacy_setting.js');
     app.post('/createPrivacyDetails',privacy.createprivacy);
     app.get('/showPrivacyDetails/:privacyId',privacy.showPrivacyDetails);

    //CREATE POST AND UPDATE POST
    const post=require('../controllers/post_content.js');  //""
    let upload = require('../config/multer.config.js');    //""
    const postlist=require('../controllers/PostList.js');
    app.post('/createOnePost', upload.array("file"), post.createPost);
    app.post('/UpdateOnePost', upload.array("file"), post.updatePost);
    app.get('/postList/:postId',postlist.postList);

    //SEND FRIEND REQUESTAND ACEPT
    const Friends=require('../controllers/friends.js');
    const Friends1=require('../controllers/friend_list.js');
    const Friends2=require('../controllers/Friends/friend_requests_tome.js');
    app.post('/sendFriendRequest',Friends.sendFriendRequest); //send request [AddFriend]
    app.post('/removeFriendFromList',Friends.removeFriendFromList); //remove from list [remove]
    app.post('/acceptFriendRequest',Friends.acceptFriendRequest); //accept friend request [accept]
    app.post('/rejectFriendRequest',Friends.rejectFriendRequest); //reject friend request [reject]
    app.get('/friendsList/:noteId',Friends1.friends_list); //get my friends list
    app.get('/getMyFriendRequestsList/:noteId',Friends2.myrequests); //get friend request to me
}