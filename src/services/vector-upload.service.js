import VectorDb from "./vector.service.js";
import { loadPdf } from "../loaders/pdfLoader.js";

const vectorDB = new VectorDb();

export const uploadFileInVectorDb = async (filePath, filename, userId) => {
  try {
    const content = await loadPdf(filePath);
    const status=await vectorDB.getOrCreateCollection();
    if (status) {
      const res= await vectorDB.insertDocument(content, {
        filename,
        userId,
      });
      return res;
    }
    return false;

  } catch (err) {
    console.log("Error in uploadFileInVectorDb:", err);
    throw err;
  }
};
