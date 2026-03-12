import Appointment from "../models/Appointment.js";

export const bookAppointment = async (req,res)=>{

 try{

   const {
     doctor_id,
     hospital_id,
     appointment_date,
     appointment_time,
     reason
   } = req.body;

   const appointment = await Appointment.create({

     patient_id:req.user._id,
     doctor_id,
     hospital_id,
     appointment_date,
     appointment_time,
     reason

   });

   res.status(201).json({
     message:"Appointment booked",
     appointment
   });

 }catch(err){
   res.status(500).json({error:err.message});
 }

}


export const getPatientAppointments = async (req,res)=>{

 try{

   const appointments = await Appointment.find({
     patient_id:req.params.patientId
   })
   .populate({
     path:"doctor_id",
     populate:{
       path:"user_id",
       select:"name email"
     }
   })
   .populate("hospital_id","hospital_name");

   res.json(appointments);

 }catch(err){
   res.status(500).json({error:err.message});
 }

}

export const getDoctorAppointments = async (req,res)=>{

 try{

   const appointments = await Appointment.find({
     doctor_id:req.params.doctorId
   })
   .populate("patient_id","name email phone")
   .populate("hospital_id","hospital_name");

   res.json(appointments);

 }catch(err){
   res.status(500).json({error:err.message});
 }

}

export const updateAppointmentStatus = async (req,res)=>{

 try{

   const appointment = await Appointment.findById(req.params.id);

   if(!appointment){
     return res.status(404).json({message:"Appointment not found"});
   }

   appointment.status = req.body.status;

   await appointment.save();

   res.json({
     message:"Appointment status updated",
     appointment
   });

 }catch(err){
   res.status(500).json({error:err.message});
 }

}