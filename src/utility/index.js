import jwt from "jsonwebtoken";
import CryptoJS from "crypto-js";


const generateJwtToken = (user) => {
  const token = jwt.sign({ userId: user.userId, email:user.email }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
  return token;
};

const encryptMethod = (value) => {
  return CryptoJS.AES.encrypt(value, process.env.SECRET_KEY).toString();
}

const decryptMethod = (value) => {
  try {
    const bytes = CryptoJS.AES.decrypt(value, process.env.SECRET_KEY);

    const decrypted = bytes.toString(CryptoJS.enc.Utf8);

    if (!decrypted) {
      console.log("❌ Failed decryption — likely wrong key or corrupted cipher");
      throw new Error("User input is mailformed")
    }

    return decrypted;
  } catch (err) {
    console.error("Error in decryptMethod: ", err);
    throw err;
  }
};


export { generateJwtToken, encryptMethod, decryptMethod };