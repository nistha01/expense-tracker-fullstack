const { json } = require('sequelize');
const User=require('../models/UserModel')


const getUserByUsername=async(req,res)=>{
   try{
    const {username}=req.body;
    const foundUser= await User.findByPk(username);
    if(!foundUser){
        res.status(404).send("User not registered");
    }
    res.status(200).send(json(foundUser));

   }catch(e){
    res.status(500).send(e.message);
   }
}

const postUser = async (req, res) => {
   try {
     const { username, password, email } = req.body;
 
    
     if (!username || !password || !email) {
       return res.status(400).json({ message: "Username, password, and email are required." });
     }
 
    
     const existingUser = await User.findOne({ where: { email } });
     if (existingUser) {
       return res.status(409).json({ message: "User with this email already exists." });
     }
 
     
     const createdUser = await User.create({ username, password, email });
 
     res.status(201).json(createdUser); 
   } catch (e) {
     res.status(500).json({ message: e.message });
   }
 };
 


module.exports={getUserByUsername,postUser};