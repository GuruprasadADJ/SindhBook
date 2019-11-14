module.exports = (app) => {
    const notes = require('../controllers/register.js');
    const login = require('../controllers/login_api.js');
    const resend = require('../controllers/resend_mobile_otp.js');
    const verifymobileotp = require('../controllers/verify_mobile_otp.api.js');
    const about = require('../controllers/about.js');
    const privacy = require('../controllers/privacy_setting.js');
    // register user
    app.post('/register', notes.create);

    //update profile api
    app.put('/update',notes.update);

    //login user
    app.post('/login', login.Authenticate);

    //resend otp
    app.post('/resendotp',resend.create1);

    //verifiying mobile otp 
    app.post('/verifymobileotp',verifymobileotp.verifyotp);

    //about api creating
    app.post('/about/create',about.createabout);
    //about api show
    app.post('/about/show',about.showaboutus);

    //privacy  api
    app.post('/privacy_setting',privacy.createprivacy);
   
   
}