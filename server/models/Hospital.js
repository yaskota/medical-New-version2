import mongoose from "mongoose";

const hospitalSchema = new mongoose.Schema({

    user_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },

    hospital_name:{
        type:String,
        required:true
    },

    government_hospital_id:{
        type:String
    },

    location:{
        type:String
    },

    address:{
        type:String
    },

    email:{
        type:String
    },

    phone_numbers:[
        {
            type:String
        }
    ],

    documents:[
        {
            type:String
        }
    ],

    photos:[
        {
            type:String
        }
    ],

    description:{
        type:String
    },

    departments:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Department"
        }
    ],

    doctors:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Doctor"
        }
    ],

    approved_by_admin:{
        type:Boolean,
        default:false
    }

},{timestamps:true});

export default mongoose.model("Hospital",hospitalSchema);