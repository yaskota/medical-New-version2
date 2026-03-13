import Review from "../models/Review.js";
import Doctor from "../models/Doctor.js";

export const createReview = async (req,res)=>{

  try{

    const {doctor_id,rating,comment} = req.body;

    const review = await Review.create({
      patient_id:req.user._id,
      doctor_id,
      rating,
      comment
    });

    res.status(201).json({
      message:"Review submitted successfully",
      review
    });

  }catch(err){
    res.status(500).json({error:err.message});
  }

}

export const getReviewsByDoctor = async (req,res)=>{

  try{

    const reviews = await Review.find({
      doctor_id:req.params.doctorId
    })
    .populate("patient_id","name photo");

    res.json({
      total:reviews.length,
      reviews
    });

  }catch(err){
    res.status(500).json({error:err.message});
  }

}

export const getReviewsByHospital = async (req,res)=>{

  try{

    const doctors = await Doctor.find({
      hospitals:req.params.hospitalId
    });

    const doctorIds = doctors.map(d=>d._id);

    const reviews = await Review.find({
      doctor_id:{$in:doctorIds}
    })
    .populate("patient_id","name")
    .populate({
      path:"doctor_id",
      populate:{
        path:"user_id",
        select:"name"
      }
    });

    res.json({
      total:reviews.length,
      reviews
    });

  }catch(err){
    res.status(500).json({error:err.message});
  }

}