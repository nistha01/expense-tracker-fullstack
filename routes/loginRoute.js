const express= require('express');
const route=express.Router();
const loginController= require('../controller/loginController')

route.post('/findUserForLogin',loginController.findUserByEmailPassword)





module.exports=route;