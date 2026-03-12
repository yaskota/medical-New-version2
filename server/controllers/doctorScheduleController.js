import DoctorSchedule from "../models/DoctorSchedule.js";

export const createDoctorSchedule = async (req,res)=>{

 try{

   const {
     doctor_id,
     hospital_id,
     day,
     start_time,
     end_time,
     slot_duration
   } = req.body;

   const schedule = await DoctorSchedule.create({
     doctor_id,
     hospital_id,
     day,
     start_time,
     end_time,
     slot_duration
   });

   res.status(201).json({
     message:"Schedule created",
     schedule
   });

 }catch(err){
   res.status(500).json({error:err.message});
 }

}


export const getDoctorSchedule = async (req,res)=>{

 try{

   const schedules = await DoctorSchedule.find({
     doctor_id:req.params.doctorId
   }).populate("hospital_id","hospital_name location");

   res.json(schedules);

 }catch(err){
   res.status(500).json({error:err.message});
 }

}

