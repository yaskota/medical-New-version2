import Doctor from "../models/Doctor.js";

export const createDoctorProfile = async (req,res)=>{

   try{

      const {doctor_id,specialization,experience,education} = req.body;

      const existingDoctor = await Doctor.findOne({user_id:req.user._id});

      if(existingDoctor){
         return res.status(400).json({
            message:"Doctor profile already exists"
         });
      }

      const doctor = await Doctor.create({

         user_id:req.user._id,
         doctor_id,
         specialization,
         experience,
         education,
         photo:req.body.photo

      });

      res.status(201).json({
         message:"Doctor profile created",
         doctor
      });

   }catch(err){

      res.status(500).json({error:err.message});

   }

}

export const getDoctorProfile = async (req,res)=>{

   try{

      const doctor = await Doctor.findOne({user_id:req.user._id});

      if(!doctor){
         return res.status(404).json({
            message:"Doctor profile not found"
         });
      }

      res.json(doctor);

   }catch(err){

      res.status(500).json({error:err.message});

   }

}