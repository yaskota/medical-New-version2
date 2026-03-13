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



export const approveDoctor = async (req,res)=>{

 try{

   const doctor = await Doctor.findById(req.params.id);

   if(!doctor){
     return res.status(404).json({message:"Doctor not found"});
   }

   doctor.approved_by_admin = true;

   await doctor.save();

   res.json({
     message:"Doctor approved successfully",
     doctor
   });

 }catch(err){
   res.status(500).json({error:err.message});
 }

}


export const getPendingDoctors = async (req,res)=>{

 try{

   const doctors = await Doctor.find({
     approved_by_admin:false
   }).populate({
     path:"user_id",
     select:"name email phone"
   });

   res.json({
     total:doctors.length,
     doctors
   });

 }catch(err){
   res.status(500).json({error:err.message});
 }

}