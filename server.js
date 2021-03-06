const express=require('express');
const bodyParser=require('body-parser');

const app=express();

app.use(bodyParser.urlencoded({extended:true}))

app.use(bodyParser.json())

// Configuring the database
const dbConfig = require('./config/database.config.js');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

// Connecting to the database
mongoose.connect(dbConfig.url, {
    useNewUrlParser: true
}).then(() => {
    console.log("Successfully connected to the database");    
}).catch(err => {
    console.log('Could not connect to the database. Exiting now...', err);
    process.exit();
});

app.get('/',(req,res)=>{
    res.json({"message":"Welcome to EasyNotes application."});
    });
    
    // Require Notes routes
    require('./app/routes/note.routes.js')(app);
    
    app.listen(8085,() =>{
        console.log("Server is listeninig on port 8085");
    });
