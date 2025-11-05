const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model.js");

require("dotenv").config();

exports.loginCtrl = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(404).json({message : "Required fields are missing"});
    }

    const user = await User.findOne({email});
    if(!user){
        return res.status(404).json({message : "Invalid email or password" });
    }

    const passMatch = await bcrypt.compare(password,user.password);
    
    if(!passMatch){
        return res.status(400).json({message : "Invalid Creds"});
    }

    const token = jwt.sign(
        {
            id : user._id ,
            email : user.email
        },
        process.env.JWT_SECRET,
        {expiresIn : "1h" }
    );

     const { password: _, ...userWithoutPassword } = user.toObject();

    res.json({ message: "Login successful", token , user : userWithoutPassword });

  } catch (error) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
}

exports.registerCtrl = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(404).json({message : "Required fields are missing"});
    }

    const existingUser = await User.findOne({email});
    if(existingUser){
        return res.status(400).json({message : "User already exist!!"});
    }

    const salt = await bcrypt.genSalt(10);
    const hashPass = await bcrypt.hash(password,salt);

    const newUser = new User({
        name,
        email,
        password : hashPass
    });

    await newUser.save();

    res.status(201).json({message : "User Created Successfully"});


  } catch (error) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
}