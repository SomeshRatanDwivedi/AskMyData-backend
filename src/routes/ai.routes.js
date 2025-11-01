import express from "express";
import aiController from "../controllers/ai.controller.js";
import validateJwt from "../middlewares/validateJwt.middleware.js";


const router = express.Router();


router.get("/", (req, res) => {
  res.send("Working /question route")
})


router.post("/ask", validateJwt, aiController.getAnswer);
router.post("/get-vector-raw-data", validateJwt, aiController.getVectorRawData);






export default router;