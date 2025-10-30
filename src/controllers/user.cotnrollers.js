
import bcrypt from "bcryptjs";
import { decryptMethod, generateJwtToken } from "../utility/index.js";
import userModel from "../models/user.model.js";

const register = async (req, res) => {
  let { email, password } = req.body;
  password = decryptMethod(password);
  try {
    const isUserAlreadyExists = await userModel.getUser({ email });
    if (isUserAlreadyExists) {
      return res.status(409).json({ success: false, message: `${email} already exists` });
    }
    const hashPassword=await bcrypt.hash(password, 10)
    const user = await userModel.registerUser({...req.body, password:hashPassword})
    res.status(201).json({ success: true, message: "User registered successfully" });
  } catch (error) {
    console.error("Error in register controller: ", error);
    res.status(500).json({ success: false, message: "Registration failed" });
  }
};

const login = async (req, res) => {
  try {
    let { email, password } = req.body;
    password = decryptMethod(password);
    const user = await userModel.getUser({ email });
    if (!user) {
      return res.status(401).json({ success: false, message: "User not found" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }
    const accessToken = generateJwtToken(user);
    delete user.password;
    res.json({ success: true, user, accessToken });
  } catch (error) {
    console.error("Error in login controller: ",error);
    res.status(500).json({ success: false, message: "Login failed" });
  }
};


const userController = {
  register,
  login
};

export default userController;
