import express from "express";

import {verifyToken} from "../middlewares/authMiddleware.js";

import {
createDoctorSchedule,
getDoctorSchedule
} from "../controllers/doctorScheduleController.js";

const router = express.Router();

router.post("/create",verifyToken,createDoctorSchedule);

router.get("/doctor/:doctorId",verifyToken,getDoctorSchedule);

export default router;