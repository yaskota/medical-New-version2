import express from "express";

import {verifyToken} from "../middlewares/authMiddleware.js";

import {
createMedicalFile,
getMedicalFileById
} from "../controllers/medicalFileController.js";

const router = express.Router();

router.post("/create",verifyToken,createMedicalFile);

router.get("/:id",verifyToken,getMedicalFileById);

export default router;