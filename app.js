const express = require('express');
const app= express();
const db= require('./utils/dbConnection');
const userRoute= require('./routes/userRoute')

const userModel= require('./models/UserModel')

app.use(express.json());

app.use('/user',userRoute);


db.sync({force:true}).then(()=>{
    app.listen(3001,(err)=>{
        if(err){
            console.log(err);
        }
        console.log("Running on port 3001");
    })
})
