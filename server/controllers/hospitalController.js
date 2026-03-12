import Hospital from "../models/Hospital.js";
import Doctor from "../models/Doctor.js";

export const createHospital = async (req,res)=>{

  try{

    const existingHospital = await Hospital.findOne({user_id:req.user._id});

    if(existingHospital){
      return res.status(400).json({message:"Hospital already exists"});
    }

    const hospital = await Hospital.create({
      user_id:req.user._id,
      hospital_name:req.body.hospital_name,
      government_hospital_id:req.body.government_hospital_id,
      location:req.body.location,
      address:req.body.address,
      email:req.body.email,
      phone_numbers:req.body.phone_numbers,
      documents:req.body.documents,
      photos:req.body.photos,
      description:req.body.description
    });

    res.status(201).json({
      message:"Hospital created successfully",
      hospital
    });

  }catch(err){
    res.status(500).json({error:err.message});
  }

}

export const getMyHospital = async (req,res)=>{

  try{

    const hospital = await Hospital.findOne({user_id:req.user._id})
    .populate("departments")
    .populate("doctors");

    if(!hospital){
      return res.status(404).json({message:"Hospital not found"});
    }

    res.json(hospital);

  }catch(err){
    res.status(500).json({error:err.message});
  }

}

export const getHospitalById = async (req,res)=>{

  try{

    const hospital = await Hospital.findById(req.params.id)
    .populate("departments")
    .populate("doctors");

    if(!hospital){
      return res.status(404).json({message:"Hospital not found"});
    }

    res.json(hospital);

  }catch(err){
    res.status(500).json({error:err.message});
  }

}


export const addDoctorToHospital = async (req,res)=>{

  try{

    const {hospital_id,doctor_id} = req.body;

    const hospital = await Hospital.findById(hospital_id);

    if(!hospital){
      return res.status(404).json({message:"Hospital not found"});
    }

    const doctor = await Doctor.findById(doctor_id);

    if(!doctor){
      return res.status(404).json({message:"Doctor not found"});
    }

    if(!hospital.doctors.includes(doctor_id)){
      hospital.doctors.push(doctor_id);
      await hospital.save();
    }

    if(!doctor.hospitals.includes(hospital_id)){
      doctor.hospitals.push(hospital_id);
      await doctor.save();
    }

    res.json({
      message:"Doctor added to hospital"
    });

  }catch(err){
    res.status(500).json({error:err.message});
  }

}

export const approveHospital = async (req,res)=>{

  try{

    const hospital = await Hospital.findById(req.params.id);

    if(!hospital){
      return res.status(404).json({message:"Hospital not found"});
    }

    hospital.approved_by_admin = true;

    await hospital.save();

    res.json({
      message:"Hospital approved"
    });

  }catch(err){
    res.status(500).json({error:err.message});
  }

}

export const getHospitalDoctors = async (req,res)=>{

  try{

    const hospital = await Hospital.findById(req.params.id)
    .populate({
      path:"doctors",
      populate:{
        path:"user_id",
        select:"name email"
      }
    });

    if(!hospital){
      return res.status(404).json({message:"Hospital not found"});
    }

    res.json(hospital.doctors);

  }catch(err){
    res.status(500).json({error:err.message});
  }

}


export const getAllHospitals = async (req,res)=>{

  try{

    const hospitals = await Hospital.find()
      .populate("departments")
      .populate({
        path:"doctors",
        populate:{
          path:"user_id",
          select:"name email"
        }
      });

    res.json({
      total:hospitals.length,
      hospitals
    });

  }catch(err){
    res.status(500).json({error:err.message});
  }

}