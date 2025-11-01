import express from "express";
import questionController from "../controllers/question.controller.js";
import validateJwt from "../middlewares/validateJwt.middleware.js";


const router = express.Router();


router.get("/", (req, res) => {
  res.send("Working /question route")
})


router.post("/", validateJwt, questionController.getAnswer);






export default router;