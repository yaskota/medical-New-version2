import express from 'express';
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes.js";
import doctorRoutes from "./routes/doctorRoutes.js";
import hospitalRoutes from "./routes/hospitalRoutes.js";
import departmentRoutes from "./routes/departmentRoutes.js";
import medicalFileRoutes from "./routes/medicalFileRoutes.js";
import patientRecordRoutes from "./routes/patientRecordRoutes.js";
import appointmentRoutes from "./routes/appointmentRoutes.js";
import scheduleRoutes from "./routes/scheduleRoutes.js";

dotenv.config();

const app=express();

connectDB();


app.use(express.json());
app.use(cookieParser());

app.use("/api/auth",authRoutes);
app.use("/api/doctors",doctorRoutes);
app.use("/api/hospitals",hospitalRoutes);
app.use("/api/departments",departmentRoutes);
app.use("/api/medical-files",medicalFileRoutes);
app.use("/api/patient-records",patientRecordRoutes);
app.use("/api/appointments",appointmentRoutes);
app.use("/api/schedules",scheduleRoutes);

const port=process.env.PORT;

app.listen(port , ()=>{
    console.log(`server is running in the port ${port}`);
})