const mongoose = require('mongoose');

const NoteSchema = mongoose.Schema({
    //user_id
    mobile_no: Number,
    otp: String,
    otp_status: Number,
    device_token: String,
    profile_update_status: Number,
    paid_user_status: Number,
    user_type: Number,
    user_login_type: Number,
    created_at: String,
    modified_at:String,
    last_login: String,
    registered_by: Number,
    //update profile details
    first_name: String,
    last_name: String,
    gender: Number,
    dob: String,
    email: String,
    email_otp: String,
    email_otp_status: Number,
    profile_picture: String
});
module.exports = mongoose.model('register', NoteSchema);