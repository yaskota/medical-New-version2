import express from "express";

import {verifyToken} from "../middlewares/authMiddleware.js";

import {
bookAppointment,
getPatientAppointments,
getDoctorAppointments,
updateAppointmentStatus
} from "../controllers/appointmentController.js";

const router = express.Router();

router.post("/book",verifyToken,bookAppointment);

router.get("/patient/:patientId",verifyToken,getPatientAppointments);

router.get("/doctor/:doctorId",verifyToken,getDoctorAppointments);

router.patch("/status/:id",verifyToken,updateAppointmentStatus);

export default router;