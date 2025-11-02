
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
    const user = await userModel.getUser({ email },true);
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


const getProfile = async (req, res) => {
  try {
    const user = await userModel.getUser({ userId: req.user.userId });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res.status(200).json({ success: true, data:user });
  } catch (error) {
    console.error("Error in getProfile controller: ", error);
    res.status(500).json({ success: false, message: "Profile retrieval failed" });
  }
}


const editProfile = async (req, res) => {
  try {
    const { firstName, lastName} = req.body;
    const updatedUser = {}
    updatedUser.firstName = firstName;
    updatedUser.lastName = lastName;
    updatedUser.updatedAt=new Date();
    const saveUser=await userModel.updateUser({userId:Number(req.user.userId)}, updatedUser);
    res.status(200).json({ success: true, data: saveUser });
  } catch (error) {
    console.error("Error in editProfile controller: ", error);
    res.status(500).json({ success: false, message: "Profile update failed" });
  }
}
const userController = {
  register,
  login,
  getProfile,
  editProfile
};

export default userController;
