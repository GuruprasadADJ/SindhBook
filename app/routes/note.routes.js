module.exports = (app) => {
    const notes = require('../controllers/register.js');
    const login = require('../controllers/login_api.js');
    const resend = require('../controllers/resend_mobile_otp.js');
    const verifymobileotp = require('../controllers/verify_mobile_otp.api.js');
    const about = require('../controllers/about.js');
    const privacy = require('../controllers/privacy_setting.js');
            const awsWorker1 = require('../controllers/aws.controller_many.js');
            let upload = require('../config/multer.config.js');
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
    //privacy show
    app.post('/privacy_show',privacy.showprivacy1);

    //upload post single and contents
    //aws post upload api
    app.post('/api/file/upload', upload.array("file"), awsWorker1.doUpload);
    app.post('/api/content/upload',awsWorker1.postcontent);
   
}