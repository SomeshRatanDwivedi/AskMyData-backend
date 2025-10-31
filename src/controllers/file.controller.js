import fileModel from "../models/file.model.js";
import { uploadFileInVectorDb } from "../services/vector-upload.service.js";
import path from "path"


const uploadFile = async (req, res) => {
  try {
    if (!req.file)
      return res.status(400).json({ message: "No file uploaded" });
    const fileInfo = {
      originalName: req.file.originalname,
      filePath: req.file.path,
      mimeType: req.file.mimetype,
      size: req.file.size,
      status: "PENDING",
      userId: req.user.userId
    }
    const saved = await fileModel.saveFile(fileInfo, { id: true, originalName: true });
    if (saved) {
      const filePath = path.join("src/uploads/userFiles", req.file.filename);
      const res = await uploadFileInVectorDb(filePath, req.file.filename, req.user.userId);
      await fileModel.updateFile({ id: saved.id }, res);
    }
    return res.json({ success: true, data: saved });
  } catch (err) {
    console.error("Error in uploadFile controller: ", err);
    res.status(500).json({ success: false, message: "Upload failed" });
  }
}

const getUserFiles = async (req, res) => {
  try {
    const files = await fileModel.getFiles({ userId: req.user.userId }, { id: true, originalName: true });

    return res.json({ success: true, data: files });
  } catch (err) {
    console.error("Error in getUserFiles controller: ", err);
    res.status(500).json({ success: false, message: "Something went wrong." });
  }
}

const fileController = {
  uploadFile,
  getUserFiles
};

export default fileController;