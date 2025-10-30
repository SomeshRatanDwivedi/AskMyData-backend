import express from "express";
import { upload } from "../middlewares/upload.middleware.js";
import fileController from "../controllers/file.controller.js";
import validateJwt from './../middlewares/validateJwt.middleware.js';
const router = express.Router();


router.get("/", (req, res) => {
  res.send("Working /file route")
})

router.post("/upload", validateJwt, upload.single("file"), fileController.uploadFile);
router.get("/get-user-files", validateJwt, fileController.getUserFiles)









export default router;