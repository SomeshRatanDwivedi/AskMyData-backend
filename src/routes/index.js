import express from "express";
import userRoute from "./user.routes.js";
import fileRoute from "./file.routes.js"

const router = express.Router();


router.get("/", (req, res) => {
  res.send("Working /file route")
})

router.use("/user", userRoute);
router.use("/file", fileRoute)








export default router;