import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema({

    user_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    photo:{
        type:String
    },
    doctor_id:{
        type:String,
        required:true
    },

    specialization:{
        type:String
    },

    experience:{
        type:Number
    },

    education:{
        type:String
    },

    hospitals:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Hospital"
        }
    ]

},{timestamps:true});

export default mongoose.model("Doctor",doctorSchema);