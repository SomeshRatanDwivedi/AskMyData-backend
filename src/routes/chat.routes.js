import express from "express";
import chatHistoryController from "../controllers/chatHistory.controller.js"
import validateJwt from "../middlewares/validateJwt.middleware.js";


const router = express.Router();





router.get("/", validateJwt, chatHistoryController.getChat);
router.post("/save-chat", validateJwt, chatHistoryController.saveChat);
router.put("/edit-chat/:id", validateJwt, chatHistoryController.editChat);
router.delete("/delete-chat/:id", validateJwt, chatHistoryController.deleteChat);






export default router;