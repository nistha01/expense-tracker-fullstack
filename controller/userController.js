const { json } = require('sequelize');
const User=require('../models/UserModel')
const bcrypt = require("bcrypt");

const getUserByEmail=async(req,res)=>{
   try{
    const {email}=req.body;
    const foundUser= await User.findByPk(email);
    if(!foundUser){
        res.status(404).send("User not registered");
    }
    res.status(200).send(json(foundUser));

   }catch(e){
    res.status(500).send(e.message);
   }
}


const SALT_ROUNDS = 10; 
const postUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!password || !email) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: "User with this email already exists." });
    }

    // blowfish encryption
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const createdUser = await User.create({ email, password: hashedPassword });

    res.status(200).json({ message: "User created successfully", user: createdUser });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};


//update user's password

const updatePassowrd=async(req,res)=>{
 try{
   const {email,password}= req.body;

  if(!email || !password){
    return res.status(400).json({ message: "Email and password are required." });
  }
   const existingUser = await User.findOne({ where: { email } });
    if (!existingUser) {
      return res.status(409).json({ message: "User with this email does not exists." });
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    existingUser.password=hashedPassword;
    existingUser.save();

 }catch(e){
  res.status(500).json({ message: e.message });
 }
}

 


module.exports={getUserByEmail,postUser,updatePassowrd};