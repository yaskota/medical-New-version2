import mongoose from "mongoose";

const medicalFileSchema = new mongoose.Schema({

    patient_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },

    doctor_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Doctor"
    },

    hospital_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Hospital"
    },

    file_url:{
        type:String
    },

    file_type:{
        type:String
    }

},{timestamps:true});

export default mongoose.model("MedicalFile",medicalFileSchema);