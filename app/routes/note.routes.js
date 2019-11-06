module.exports = (app) => {
    const notes = require('../controllers/register.js');
    const login = require('../controllers/login_api.js');
    const resend = require('../controllers/resend_mobile_otp.js');
    const verifymobileotp = require('../controllers/verify_mobile_otp.api.js');
   
    // register user
    app.post('/register', notes.create);

    //update profile api
    app.put('/update',notes.update);

    //login user
    app.post('/login', login.Authenticate);

    //resend otp
    app.put('/resendotp',resend.create1);

    //verifiying mobile otp 
    app.post('/verifymobileotp',verifymobileotp.verifyotp);

   
   
}