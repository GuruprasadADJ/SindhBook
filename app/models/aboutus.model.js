const mongoose = require('mongoose');

const NoteSchema = mongoose.Schema({
    user_id : String,
    
        work : Array,
        education : Array,
        places_lived : Array,
        contact_info : Number
  
});
module.exports = mongoose.model("about", NoteSchema);