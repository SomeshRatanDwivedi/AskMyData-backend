import express from "express";
import userContoller from "../controllers/user.cotnrollers.js"
const router = express.Router();


router.get("/", (req, res) => {
  res.send("Working /user route")
})

router.post("/login", userContoller.login);
router.post("/register", userContoller.register);








export default router;