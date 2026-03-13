import express from "express";

import {verifyToken} from "../middlewares/authMiddleware.js";

import {
createReview,
getReviewsByDoctor,
getReviewsByHospital
} from "../controllers/reviewController.js";

const router = express.Router();

router.post("/create",verifyToken,createReview);

router.get("/doctor/:doctorId",getReviewsByDoctor);

router.get("/hospital/:hospitalId",getReviewsByHospital);

export default router;