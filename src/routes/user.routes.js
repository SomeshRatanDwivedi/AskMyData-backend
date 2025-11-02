import express from "express";
import userContoller from "../controllers/user.cotnrollers.js"
import validateJwt from './../middlewares/validateJwt.middleware.js';
const router = express.Router();


router.post("/login", userContoller.login);
router.post("/register", userContoller.register);
router.get('/profile', validateJwt, userContoller.getProfile)
router.put('/edit-profile', validateJwt, userContoller.editProfile)







export default router;