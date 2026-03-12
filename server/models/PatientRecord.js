    import mongoose from "mongoose";

    const patientRecordSchema = new mongoose.Schema({

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

        disease:{
            type:String
        },

        symptoms:[
            {
                type:String
            }
        ],

        diagnosis:{
            type:String
        },

        prescription:{
            type:String
        },

        medicines:[
            {
                name:String,
                dosage:String,
                duration:String
            }
        ],

        visit_date:{
            type:Date
        },

        next_visit:{
            type:Date
        }

    },{timestamps:true});

    export default mongoose.model("PatientRecord",patientRecordSchema);