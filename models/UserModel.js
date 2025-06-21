const {Sequelize, DataTypes}=require('sequelize');
const sequelize=require('../utils/dbConnection');



const User=sequelize.define('user',{
   
    
  userID: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
    unique: true,                    
  },
  email:{
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true,
    unique: true,
    validate: {
      isEmail: true,
    }
  },
    password:{
        type:DataTypes.STRING,
        allowNull:false
    }


})

module.exports=User;

