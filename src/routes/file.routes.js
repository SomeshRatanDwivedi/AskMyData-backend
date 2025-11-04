import express from "express";
import { upload } from "../middlewares/upload.middleware.js";
import fileController from "../controllers/file.controller.js";
import validateJwt from './../middlewares/validateJwt.middleware.js';
import validateAdminUser from "../middlewares/validateAdminUser.js";
const router = express.Router();


router.get("/", (req, res) => {
  res.send("Working /file route")
})

router.post("/upload", validateJwt, upload.single("file"), fileController.uploadFile);
//for getting the files of a login user
router.get("/get-user-files", validateJwt, fileController.getUserFiles);
//for getting the files specific user, in admin login. (id is userId of specific user, admin is checking the profile of specific user)
router.get("/get-user-files/:id", validateJwt, validateAdminUser, fileController.getUserFiles);
//delte file of any user. for admin only
router.delete("/delete-file/:userId/:fileId", validateJwt, validateAdminUser, fileController.deleteFiles);
//delete file of login user
router.delete("/delete-file/:fileId", validateJwt, fileController.deleteFiles);









export default router;