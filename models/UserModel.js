const {Sequelize, DataTypes}=require('sequelize');
const sequelize=require('../utils/dbConnection');



const User=sequelize.define('user',{
   
    email:{
        type:DataTypes.STRING,
        allowNull:false,
        primaryKey:true,
    },
    password:{
        type:DataTypes.STRING,
        allowNull:false
    }

})

module.exports=User;

