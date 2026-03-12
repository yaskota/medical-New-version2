import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({

    patient_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },

    doctor_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Doctor"
    },

    rating:{
        type:Number,
        min:1,
        max:5
    },

    comment:{
        type:String
    }

},{timestamps:true});

export default mongoose.model("Review",reviewSchema);