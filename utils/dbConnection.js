const {Sequelize}= require('sequelize');

const sequelize=new Sequelize('expensetracker', 'root', 'root', {
    host: 'localhost',
    dialect: 'mysql'
  });


(async()=>{
    try{
       await sequelize.authenticate();
       console.log("connected to the Database ");

    }catch(err){
        console.log("Unable to connect to the db",err)
    }
  })()


  module.exports=sequelize;