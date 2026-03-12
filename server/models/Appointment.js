import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema({

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

    appointment_date:{
        type:Date
    },

    appointment_time:{
        type:String
    },

    status:{
        type:String,
        enum:["pending","confirmed","completed","cancelled"],
        default:"pending"
    },

    reason:{
        type:String
    }

},{timestamps:true});

export default mongoose.model("Appointment",appointmentSchema);