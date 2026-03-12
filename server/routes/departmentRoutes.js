import express from "express";

import {verifyToken} from "../middlewares/authMiddleware.js";
import {allowHospital} from "../middlewares/roleMiddleware.js";

import {
createDepartment,
addDoctorsToDepartment,
getDepartmentsByHospital,
getDepartmentById
} from "../controllers/departmentController.js";

const router = express.Router();

router.post("/create",verifyToken,allowHospital,createDepartment);

router.post("/add-doctors",verifyToken,allowHospital,addDoctorsToDepartment);

router.get("/hospital/:hospitalId",verifyToken,getDepartmentsByHospital);

router.get("/:id",verifyToken,getDepartmentById);

export default router;