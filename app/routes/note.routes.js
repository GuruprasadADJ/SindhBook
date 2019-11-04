module.exports = (app) => {
    const notes = require('../controllers/register.js');
    const login = require('../controllers/login_api.js');
    //const udateprofile = require('../controllers/update_profile_api.js');
    const resend = require('../controllers/resend_mobile_otp.js');
    const verifymobileotp = require('../controllers/verify_mobile_otp.api.js');
   
    // register user
    app.post('/register', notes.create);

    //update profile api
    app.put('/update',notes.update);
    // // Retrieve all Notes
    // app.get('/register', notes.findAll);

    // // Retrieve a single Note with noteId
    // app.get('/register/:noteId', notes.findOne);

    // // Update a Note with noteId
    // app.put('/register/:noteId', notes.update);

    // // Delete a Note with noteId
    // app.delete('/register/:noteId', notes.delete);

    //login user
    app.get('/login', login.Authenticate);

    // //send otp
    // app.post('/sendotp',send_otp.create);

    //resend otp
    app.put('/resendotp',resend.create1);

    //verifiying mobile otp 
    app.get('/verifymobileotp',verifymobileotp.verifyotp);

   
}