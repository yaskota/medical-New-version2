import Department from "../models/Department.js";
import Doctor from "../models/Doctor.js";
import Hospital from "../models/Hospital.js";

export const createDepartment = async (req,res)=>{

  try{

    const {department_name,description,hospital_id} = req.body;

    const department = await Department.create({
      hospital_id,
      department_name,
      description
    });

    await Hospital.findByIdAndUpdate(
      hospital_id,
      {$push:{departments:department._id}}
    );

    res.status(201).json({
      message:"Department created successfully",
      department
    });

  }catch(err){
    res.status(500).json({error:err.message});
  }

}

export const addDoctorsToDepartment = async (req,res)=>{

  try{

    const {department_id,doctor_ids} = req.body;

    const department = await Department.findById(department_id);

    if(!department){
      return res.status(404).json({message:"Department not found"});
    }

    doctor_ids.forEach(id=>{
      if(!department.doctors.includes(id)){
        department.doctors.push(id);
      }
    });

    await department.save();

    await Doctor.updateMany(
      {_id:{$in:doctor_ids}},
      {$set:{department_id:department_id}}
    );

    res.json({
      message:"Doctors added to department"
    });

  }catch(err){
    res.status(500).json({error:err.message});
  }

}

export const getDepartmentsByHospital = async (req,res)=>{

  try{

    const departments = await Department.find({
      hospital_id:req.params.hospitalId
    }).populate({
      path:"doctors",
      populate:{
        path:"user_id",
        select:"name email"
      }
    });

    res.json({
      total:departments.length,
      departments
    });

  }catch(err){
    res.status(500).json({error:err.message});
  }

}

export const getDepartmentById = async (req,res)=>{

  try{

    const department = await Department.findById(req.params.id)
    .populate({
      path:"doctors",
      populate:{
        path:"user_id",
        select:"name email"
      }
    });

    if(!department){
      return res.status(404).json({message:"Department not found"});
    }

    res.json(department);

  }catch(err){
    res.status(500).json({error:err.message});
  }

}