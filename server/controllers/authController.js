import User from "../models/User.js";
import OTP from "../models/OTP.js";
import bcrypt from "bcrypt";
import { sendOTP } from "../utils/sendMail.js";

import jwt from "jsonwebtoken";

export const register = async (req,res) => {

 try{
   console.log("registration start")
   const {name,email,phone,password,role} = req.body;

   const existingUser = await User.findOne({email});

   if(existingUser){
      return res.status(400).json({message:"User already exists"});
   }

   const hashedPassword = await bcrypt.hash(password,10);

   const user = await User.create({
       name,
       email,
       phone,
       password:hashedPassword,
       role
   });

   const otp = Math.floor(100000 + Math.random()*900000).toString();

   await OTP.create({
      email,
      otp,
      expiresAt: Date.now()+10*60*1000
   });
   console.log("email start");

   await sendOTP(email,otp);
   console.log("email send")

   res.json({
      message:"User registered. OTP sent to email"
   });

 }catch(err){
    res.status(500).json({error:err.message});
 }

}


export const verifyOTP = async (req,res)=>{

  const {email,otp} = req.body;

  const otpRecord = await OTP.findOne({email,otp});

  if(!otpRecord){
     return res.status(400).json({message:"Invalid OTP"});
  }

  if(otpRecord.expiresAt < Date.now()){
     return res.status(400).json({message:"OTP expired"});
  }

  await User.updateOne({email},{isVerified:true});

  await OTP.deleteMany({email});

  res.json({
     message:"Email verified successfully"
  });

}


export const login = async (req,res)=>{

  const {email,password} = req.body;

  const user = await User.findOne({email});

  if(!user){
     return res.status(404).json({message:"User not found"});
  }

  if(!user.isVerified){
     return res.status(401).json({message:"Verify email first"});
  }

  const isMatch = await bcrypt.compare(password,user.password);

  if(!isMatch){
     return res.status(400).json({message:"Invalid password"});
  }

  const token = jwt.sign(
    {id:user._id,role:user.role},
    process.env.JWT_SECRET,
    {expiresIn:"7d"}
  );

  res.cookie("token",token,{
     httpOnly:true,
     secure:false,
     sameSite:"none"
  });

  res.json({
     message:"Login successful",
     user
  });

}


export const logout = (req,res)=>{

  res.clearCookie("token");

  res.json({
    message:"Logged out successfully"
  });

}