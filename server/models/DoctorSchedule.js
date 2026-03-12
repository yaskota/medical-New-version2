import mongoose from "mongoose";

const doctorScheduleSchema = new mongoose.Schema({

    doctor_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Doctor"
    },

    hospital_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Hospital"
    },

    day:{
        type:String
    },

    start_time:{
        type:String
    },

    end_time:{
        type:String
    },

    slot_duration:{
        type:Number
    }

},{timestamps:true});

export default mongoose.model("DoctorSchedule",doctorScheduleSchema);