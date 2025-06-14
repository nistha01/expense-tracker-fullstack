const express= require('express');
const route= express.Router();
const userController= require('../controller/userController')

route.get('/getUser',userController.getUserByEmail);
route.post('/postUser',userController.postUser);




module.exports=route;