const express = require('express');
const cors = require('cors');
const app= express();
const db= require('./utils/dbConnection');
const userRoute= require('./routes/userRoute')
const loginRoute=require('./routes/loginRoute')
const expenseRoute=require('./routes/expenseRoute')

//const userModel= require('./models/UserModel')

require('./models')

app.use(cors());
app.use(express.json());

app.use('/user',userRoute);
app.use('/login',loginRoute);
app.use('/expense',expenseRoute)


db.sync({force:true}).then(()=>{
    app.listen(3001,(err)=>{
        if(err){
            console.log(err);
        }
        console.log("Running on port 3001");
    })
})
