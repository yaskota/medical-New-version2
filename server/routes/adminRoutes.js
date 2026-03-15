import express from "express";
import { 
  getPatients, 
  getDoctors, 
  getPendingDoctors, 
  approveDoctor, 
  rejectDoctor 
} from "../controllers/adminController.js";
import { verifyToken} from "../middlewares/authMiddleware.js";
import { allowAdmin } from "../middlewares/roleMiddleware.js";

const router = express.Router();

// Base GET routes
router.get("/patients", verifyToken, allowAdmin, getPatients);
router.get("/doctors", verifyToken, allowAdmin, getDoctors);

// Doctor approval routes
router.get("/pending-doctors", verifyToken, allowAdmin, getPendingDoctors);
router.put("/approve-doctor/:id", verifyToken, allowAdmin, approveDoctor);
router.delete("/reject-doctor/:id", verifyToken, allowAdmin, rejectDoctor);

export default router;
