import userModel from "../models/user.model.js";

const validateAdminUser = async(req, res, next) => {
  const userId = req.user.userId;
  const user = await userModel.getUser({ userId });
  if(!user.isAdmin) {
    return res.status(403).json({ success: false, message: "This operation is restricted to admin users." });
  }
  next();
};
export default validateAdminUser;