import mongoose from "mongoose";

const departmentSchema = new mongoose.Schema({

    hospital_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Hospital",
        required:true
    },

    department_name:{
        type:String,
        required:true
    },

    description:{
        type:String
    },

    doctors:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Doctor"
        }
    ]

},{timestamps:true});

export default mongoose.model("Department",departmentSchema);