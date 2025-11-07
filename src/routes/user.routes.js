import express from "express";
import userContoller from "../controllers/user.controllers.js"
import validateJwt from './../middlewares/validateJwt.middleware.js';
import validateAdminUser from "../middlewares/validateAdminUser.js";
const router = express.Router();


router.post("/login", userContoller.login);
router.post("/register", userContoller.register);
router.get('/profile', validateJwt, userContoller.getProfile);
router.put('/edit-profile', validateJwt, userContoller.editProfile);

router.put('/:id/enable-disable', validateJwt, validateAdminUser, userContoller.enableDisableUser);

router.get("/all-users", validateJwt, validateAdminUser, userContoller.getAllUsers);
router.delete("/:id", validateJwt, validateAdminUser, userContoller.deleteUser);
router.get("/:id", validateJwt, userContoller.getUserByUserId);
router.put("/:id/make-remove-admin", validateJwt, validateAdminUser, userContoller.makeRemoveAdmin);








export default router;