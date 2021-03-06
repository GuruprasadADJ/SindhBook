module.exports = (app) => {

    // register user update profile api
    const notes = require('../controllers/register.js');
    app.post('/register', notes.create);
    app.put('/update',notes.update);

    // Edit profile details
    const e_profile = require('../controllers/edit_profile_details.js');
    app.get('/editProfileDetails/:userId',e_profile.editProfile);

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
     const about = require('../controllers/About/about.js');
     const deleteAbout=require('../controllers/About/deleteAbout.js');
     const updateabout=require('../controllers/About/UpdateAbout.js');
     app.post('/createAboutDetails',about.createabout);
     app.get('/showAboutDetails/:about1Id',about.showaboutdetails);
     app.post('/deleteAboutDetails',deleteAbout.deleteAboutDetails);/***06/12/2019** */
     app.post('/updateAboutDetails',updateabout.updateAboutDetails);/***06/12/2019** */
 
     //privacy  api
     const privacy = require('../controllers/privacy_setting.js');
     app.post('/createPrivacyDetails',privacy.createprivacy);
     app.get('/showPrivacyDetails/:privacyId',privacy.showPrivacyDetails);

    //CREATE POST AND UPDATE POST
    const post=require('../controllers/Posts/post_content.js');  //""
    let upload = require('../config/multer.config.js');    //""
    const postlist=require('../controllers/Posts/PostList.js');
    const deletePost=require('../controllers/Posts/DeletePost.js');/*****07/12/2019 ***/
    const getPostDetails=require('../controllers/Posts/SinglePostToUpdate');/****07/12/2019 ****/
    app.post('/createOnePost', upload.array("file"), post.createPost);
    app.post('/updatePostDetails', upload.array("file"), post.updatePost);
    app.post('/deletePostDetails',deletePost.deletePost);
    app.get('/getPostDetails/:id',getPostDetails.getPostDetails);
    app.get('/postList/:postId',postlist.postList);

    // LIKE , SHARE , COMMENT POST
    const like_post=require('../controllers/Posts/LikePost.js'); 
    const comment_post=require('../controllers/Posts/CommentPost.js');
    const share_post=require('../controllers/Posts/SharePost.js'); 
    const get_comments=require('../controllers/Posts/GetCommentList.js'); 
    app.post('/likePost',like_post.LikePost); 
    app.post('/commentPost',comment_post.CommentPost);
    app.get('/commentList/:postId',get_comments.GetComments);
    app.post('/sharePost',share_post.SharePost);
    

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

    //all users list
    const allusers=require('../controllers/all_users_list.js')
    app.get('/allUsersList/:Id', allusers.registersfindAll);

    // GET PROFILE DETAILS
    const profile=require('../controllers/get_profile.js');
    app.get('/getProfileDetails/:user_id/:friend_id',profile.getProfileDetails); //onclick  gets profile details

    //new frnds api 
    const new_friends=require('../controllers/Friends/SendFriendRequest.js');//******* */
    const new_rejectfrnds=require('../controllers/Friends/RejectFriendRequest.js');//**** */
    const accept_friends=require('../controllers/Friends/AcceptFriendRequest.js');//****** */
    const GetFriendList=require('../controllers/Friends/GetFriendsList.js');//***** */
    const UnFriend=require('../controllers/Friends/UnFriend.js');//***** */
    const request_list=require('../controllers/Friends/RequestedFriendList.js');
    const all_users=require('../controllers/Friends/AllUsersList.js');
    const block_user=require('../controllers/Friends/BlockFriend.js');
    const suggestions=require('../controllers/Friends/Suggestions.js');
    app.post('/sendFriendRequest1',new_friends.SendFriendRequest1); //**** */
    app.post('/rejectFriendRequest1',new_rejectfrnds.RejectFriendReuest1)//********** */
    app.post('/acceptFriendRequest1',accept_friends.AcceptFriendRequest1); //**** */
    app.get('/getFriendsList1/:noteId',GetFriendList.GetFriendsList1);//****** */
    app.post('/unFriend1',UnFriend.UnFriend1);//**** */
    app.get('/requestedList1/:userId',request_list.RequestedFriendList); //**** */
    app.get('/allUsersList1/:userId',all_users.GetAllUsersList); //***** */
    app.post('/blockFriend1',block_user.BlockFriend1);//***** */
    app.get('/suggestionsList/:userId',suggestions.suggestions);//******* */

    //API'S FOR RELATIVES UnRelative
    const Relativesrelations=require('../controllers/Relatives/getAllRelationsList.js');/**** */
    const SendRelativeRequest=require('../controllers/Relatives/SendRelativeRequest.js');/***** */
    const AcceptRelativeRequest=require('../controllers/Relatives/AcceptRelativeRequest.js');/*** */
    const RejectRelativeRequest=require('../controllers/Relatives/RejectRelativeRequest.js');/***** */
    const RequestedRelativeList=require('../controllers/Relatives/RequestedRelativeList.js');/***** */
    const GetAllRelativesList=require('../controllers/Relatives/AllRelativesList.js');/*** */
    const UnRelative=require('../controllers/Relatives/UnRelative.js');/***** */
    const GetRelativesList=require('../controllers/Relatives/GetRelativesList.js');/***** */
    const BlockRelative=require('../controllers/Relatives/BlockRelative.js');//******* */
    const R_suggestions=require('../controllers/Relatives/R_suggestions.js');//*******RELATIVE SUGGESTIONS */
    app.get('/getAllRelationsList',Relativesrelations.getAllRelationsList); /****RELATIONS LIST*** */
    app.post('/sendRelativeRequest',SendRelativeRequest.SendRelativeRequest);/*****REQUEST****** */
    app.post('/acceptRelativeRequest',AcceptRelativeRequest.AcceptRelativeRequest);/****ACCEPT ***** */
    app.post('/rejectRelativeRequest',RejectRelativeRequest.RejectRelativeRequest);/****REJECT*** */
    app.get('/requestedRelativeList/:userId',RequestedRelativeList.RequestedRelativeList);/*****REQUESTED LIST**** */
    app.get('/getAllRelativesList/:userId',GetAllRelativesList.GetAllRelativesList);/***REQUESTED LIST****** */
    app.post('/unRelative',UnRelative.UnRelative); /**** UNRELATIVE *** */
    app.get('/getRelativesList/:noteId',GetRelativesList.GetRelativesList);/****MY RELATIVES LIST****** */
    app.post('/blockRelative',BlockRelative.BlockRelative1);/************ BLOCK RELATIVE  */
    app.get('/relativeSuggestions/:userId',R_suggestions.relativeSuggestions);///*******RELATIVE SUGGESTIONS */


    //search friend
    const searchfriend=require('../controllers/Friends/SearchFriend.js');/******* */
    app.get('/searchUser/:id/:input',searchfriend.searchfriend);/*******seacrh any user, displays except blocked one's */
}