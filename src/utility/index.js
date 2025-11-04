import jwt from "jsonwebtoken";
import CryptoJS from "crypto-js";
import fs from "fs"

const generateJwtToken = (user) => {
  return jwt.sign(
    { userId: user.userId, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );
};

// ✅ Encrypt
const encryptMethod = (value) => {
  return CryptoJS.AES.encrypt(String(value), process.env.SECRET_KEY).toString();
};

// ✅ Decrypt
const decryptMethod = (value) => {
  try {
    const bytes = CryptoJS.AES.decrypt(value, process.env.SECRET_KEY);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    if (decrypted === "") {
      console.warn("⚠ Decrypted value is an empty string");
      return "";
    }
    if (!decrypted) {
      console.log("❌ Failed decryption — likely wrong key or corrupted cipher");
      throw new Error("Malformed encrypted text");
    }

    return decrypted;
  } catch (err) {
    console.error("Error in decryptMethod: ", err);
    throw err;
  }
};
async function deleteFileFromServer(filePath) {

  try {
    // Check if file exists before deleting
    const isFileExist=await fs.access(filePath);

    // Delete the file
    if (isFileExist) {
      await fs.unlink(filePath);
    }
  } catch (err) {
    if (err.code === 'ENOENT') {
      console.log('File does not exist');
    } else {
      console.error('Error deleting file:', err);
    }
  }
}

export {
  generateJwtToken,
  encryptMethod,
  decryptMethod,
  deleteFileFromServer
};
