import express from "express";

import {verifyToken} from "../middlewares/authMiddleware.js";
import {allowHospital,allowAdmin} from "../middlewares/roleMiddleware.js";
import { getAllHospitals } from "../controllers/hospitalController.js";

import {
createHospital,
getMyHospital,
getHospitalById,
addDoctorToHospital,
approveHospital,
getHospitalDoctors
} from "../controllers/hospitalController.js";

const router = express.Router();

router.post("/create",verifyToken,allowHospital,createHospital);

router.get("/my",verifyToken,allowHospital,getMyHospital);

router.get("/:id",verifyToken,getHospitalById);

router.post("/add-doctor",verifyToken,allowHospital,addDoctorToHospital);

router.patch("/approve/:id",verifyToken,allowAdmin,approveHospital);

router.get("/:id/doctors",verifyToken,getHospitalDoctors);

router.get("/",verifyToken,getAllHospitals);

export default router;