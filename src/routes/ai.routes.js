import express from "express";
import aiController from "../controllers/ai.controller.js";
import validateJwt from "../middlewares/validateJwt.middleware.js";
import { rateLimiter } from "../middlewares/rateLimiter.middleware.js";


const router = express.Router();

router.post("/ask", validateJwt, rateLimiter(process.env.REQUEST_PER_MIN, process.env.REQUEST_TIME_SEC), aiController.getAnswer);
router.post("/get-vector-raw-data", validateJwt, aiController.getVectorRawData);






export default router;