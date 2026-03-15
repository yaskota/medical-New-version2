import express from "express";
import {register,verifyOTP,login,logout,fetchpatients} from "../controllers/authController.js";

const router = express.Router();

router.post("/register",register);
router.post("/verify-otp",verifyOTP);
router.post("/login",login);
router.post("/logout",logout);
router.get("/patients",fetchpatients);

export default router;