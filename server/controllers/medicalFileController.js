import MedicalFile from "../models/MedicalFile.js";

export const createMedicalFile = async (req,res)=>{

  try{

    const {patient_id,doctor_id,hospital_id,file_url,file_type} = req.body;

    const medicalFile = await MedicalFile.create({
      patient_id,
      doctor_id,
      hospital_id,
      file_url,
      file_type
    });

    res.status(201).json({
      message:"Medical file uploaded successfully",
      medicalFile
    });

  }catch(err){
    res.status(500).json({error:err.message});
  }

}

export const getMedicalFileById = async (req,res)=>{

  try{

    const medicalFile = await MedicalFile.findById(req.params.id)
    .populate("patient_id","name email")
    .populate({
      path:"doctor_id",
      populate:{
        path:"user_id",
        select:"name email"
      }
    })
    .populate("hospital_id","hospital_name");

    if(!medicalFile){
      return res.status(404).json({message:"Medical file not found"});
    }

    res.json(medicalFile);

  }catch(err){
    res.status(500).json({error:err.message});
  }

}

