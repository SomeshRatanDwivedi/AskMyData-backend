import fileModel from "../models/file.model.js";
import { uploadFileInVectorDb } from "../services/vector-upload.service.js";
import path from "path"
import VectorDb from "../services/vector.service.js";
import { deleteFileFromServer } from "../utility/index.js";

const vectorDb = new VectorDb();
const uploadFile = async (req, res) => {
  try {
    if (!req.file)
      return res.status(400).json({ message: "No file uploaded" });
    const fileInfo = {
      originalName: req.file.originalname,
      filePath: `/uploads/userFiles/${req.file.filename}`,
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
    return res.status(200).json({ success: true, data: saved });
  } catch (err) {
    console.error("Error in uploadFile controller: ", err);
    res.status(500).json({ success: false, message: "Upload failed" });
  }
}

const getUserFiles = async (req, res) => {
  try {
    const userId = req.params.id ?? req.user.userId 
    const files = await fileModel.getFiles({ userId: Number(userId) }, { id: true, originalName: true, size: true, status: true, createdAt:true, filePath:true });

    return res.json({ success: true, data: files });
  } catch (err) {
    console.error("Error in getUserFiles controller: ", err);
    res.status(500).json({ success: false, message: "Something went wrong." });
  }
}

const deleteFiles = async (req, res) => {
  try {
    let { userId, fileId } = req.params;
    userId = userId ?? req.user.userId;
    const files = await fileModel.getFiles({ userId: Number(userId), id: fileId }, { id: true, qDrantIds: true, status: true,filePath:true });
    if (!files.length) {
      return res.status(404).json({success:false, message: "No files found" });
    }
    if (files[0].status === "EMBEDDED") {
      await vectorDb.deleteVectors(files[0].qDrantIds);
    }
    const fileAbsPath = path.join("src", files[0].filePath);
    await deleteFileFromServer(fileAbsPath)
    const deletedFile = await fileModel.deleteFile({ id: fileId, userId:Number(userId) }, { id: true, originalName: true});
    return res.json({ success: true, data: deletedFile });
  } catch (err) {
    console.error("Error in deleteFiles controller: ", err);
    res.status(500).json({ success: false, message: "Something went wrong." });
  }
}
const fileController = {
  uploadFile,
  getUserFiles,
  deleteFiles
};

export default fileController;