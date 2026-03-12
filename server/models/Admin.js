import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({

    user_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },

    role_type:{
        type:String
    }

},{timestamps:true});

export default mongoose.model("Admin",adminSchema);