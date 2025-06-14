const User= require('../models/UserModel');
const bcrypt = require('bcrypt');


const findUserByEmailPassword = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required." });
      }
  
      const foundUser = await User.findByPk(email);
  
      if (!foundUser) {
        return res.status(404).json({ message: "No user found with this email." });
      }
  
      // Compare user and stored pass
      const isPasswordCorrect = await bcrypt.compare(password, foundUser.password);
      if (!isPasswordCorrect) {
        return res.status(401).json({ message: "Wrong password." });
      }
  
      res.status(200).json({ message: "Login successful", user: foundUser });
  
    } catch (e) {
      console.error(e);
      res.status(500).json({ message: e.message });
    }
  };


module.exports={findUserByEmailPassword}