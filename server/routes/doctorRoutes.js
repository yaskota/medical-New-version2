import express from "express";

import {verifyToken} from "../middlewares/authMiddleware.js";
import {allowDoctor} from "../middlewares/roleMiddleware.js";

import {
createDoctorProfile,
getDoctorProfile
} from "../controllers/doctorController.js";

const router = express.Router();

router.post("/create",verifyToken,allowDoctor,createDoctorProfile);

router.get("/profile",verifyToken,allowDoctor,getDoctorProfile);

export default router;