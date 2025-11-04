
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
    const { firstName, lastName, groqApiKey } = req.body;
    const updatedUser = {}
    updatedUser.firstName = firstName;
    updatedUser.lastName = lastName;
    updatedUser.groqApiKey=groqApiKey
    updatedUser.updatedAt=new Date();
    const saveUser = await userModel.updateUser({ userId: Number(req.user.userId)}, updatedUser);
    res.status(200).json({ success: true, data: saveUser });
  } catch (error) {
    console.error("Error in editProfile controller: ", error);
    res.status(500).json({ success: false, message: "Profile update failed" });
  }
}

const getAllUsers = async (req, res) => {
  try {
    const users = await userModel.getAllUsers();
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    console.error("Error in getAllUsers controller: ", error);
    res.status(500).json({ success: false, message: "User retrieval failed" });
  }
}

const getUserByUserId = async (req, res) => {
  try {
    const user = await userModel.getUser({ userId: Number(req.params.id) });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    console.error("Error in getUserByUserId controller: ", error);
    res.status(500).json({ success: false, message: "User retrieval failed" });
  }
}

const deleteUser = async (req, res) => {
  try {
    const user = await userModel.getUser({ userId: Number(req.params.id) });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    await userModel.deleteUser({ userId: Number(req.params.id) });
    res.status(200).json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    console.error("Error in deleteUser controller: ", error);
    res.status(500).json({ success: false, message: "User deletion failed" });
  }
}

const enableDisableUser = async (req, res) => {
  try {
    const user = await userModel.getUser({ userId: Number(req.params.id) });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    const disableUser={isActive:!user.isActive, updatedAt:new Date()};
    await userModel.updateUser({ userId: Number(req.params.id) }, disableUser);
    res.status(200).json({ success: true, message: "User disabled successfully" });
  } catch (error) {
    console.error("Error in disableUser controller: ", error);
    res.status(500).json({ success: false, message: "User disabling failed" });
  }
}

const makeRemoveAdmin = async(req, res) => {
  try {
    const user = await userModel.getUser({ userId: Number(req.params.id) });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    const makeAdminUser = { isAdmin: !user.isAdmin, updatedAt: new Date() };
    await userModel.updateUser({ userId: Number(req.params.id) }, makeAdminUser);
    res.status(200).json({ success: true, message: "User made admin successfully" });
  } catch (error) {
    console.error("Error in makeAdmin controller: ", error);
    res.status(500).json({ success: false, message: "User making admin failed" });
  }
}
const userController = {
  register,
  login,
  getProfile,
  editProfile,
  getAllUsers,
  getUserByUserId,
  deleteUser,
  enableDisableUser,
  makeRemoveAdmin
};

export default userController;
