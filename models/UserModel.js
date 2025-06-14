const {Sequelize, DataTypes}=require('sequelize');
const sequelize=require('../utils/dbConnection');



const User=sequelize.define('user',{
   
    username:{
        type:DataTypes.STRING,
        allowNull:false,
        primaryKey:true,
        
    },
    email:{
        type:DataTypes.STRING,
        allowNull:false
    },
    password:{
        type:DataTypes.STRING,
        allowNull:false
    }

})

module.exports=User;

