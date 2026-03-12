import express from "express";

import {verifyToken} from "../middlewares/authMiddleware.js";

import {
createPatientRecord,
getPatientRecordById
} from "../controllers/patientRecordController.js";

const router = express.Router();

router.post("/create",verifyToken,createPatientRecord);

router.get("/:id",verifyToken,getPatientRecordById);

export default router;