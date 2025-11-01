import express from "express";
import userRoute from "./user.routes.js";
import fileRoute from "./file.routes.js"
import aiRoute from "./ai.routes.js"
import chatHistoryRoute from "./chat.routes.js";

const router = express.Router();


router.get("/", (req, res) => {
  res.send("Working /file route")
})

router.use("/user", userRoute);
router.use("/file", fileRoute);
router.use("/ai", aiRoute);
router.use("/chat", chatHistoryRoute);







export default router;