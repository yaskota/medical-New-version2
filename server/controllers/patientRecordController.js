import PatientRecord from "../models/PatientRecord.js";

export const createPatientRecord = async (req,res)=>{

  try{

    const {
      patient_id,
      doctor_id,
      hospital_id,
      disease,
      symptoms,
      diagnosis,
      prescription,
      medicines,
      visit_date,
      next_visit
    } = req.body;

    const record = await PatientRecord.create({
      patient_id,
      doctor_id,
      hospital_id,
      disease,
      symptoms,
      diagnosis,
      prescription,
      medicines,
      visit_date,
      next_visit
    });

    res.status(201).json({
      message:"Patient record created successfully",
      record
    });

  }catch(err){
    res.status(500).json({error:err.message});
  }

}


export const getPatientRecordById = async (req,res)=>{

  try{

    const record = await PatientRecord.findById(req.params.id)
      .populate("patient_id","name email phone")
      .populate({
        path:"doctor_id",
        populate:{
          path:"user_id",
          select:"name email"
        }
      })
      .populate("hospital_id","hospital_name location");

    if(!record){
      return res.status(404).json({
        message:"Patient record not found"
      });
    }

    res.json(record);

  }catch(err){
    res.status(500).json({error:err.message});
  }

}


