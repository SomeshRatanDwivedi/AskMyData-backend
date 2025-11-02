import { PrismaClient } from "../generated/prisma/client.ts";
const prisma = new PrismaClient();

const registerUser = async (user) => {
  try {
    const newUser = await prisma.user.create({
      data: user,
    });
    return newUser;
  } catch (err) {
    console.log("Erro in creating user: ", err)
    throw err;
  }
}

const getUser = async (condition, isPassReq=false) => {
  try {
    const user = await prisma.user.findUnique({
      where: condition,
      select: {
        userId: true,
        firstName: true,
        lastName: true,
        createdAt: true,
        updatedAt: true,
        password:isPassReq
      }
    });
    return user;
  } catch (err) {
    console.log("Erro in getting user: ", err)
    throw err;
  }
}

const updateUser = async (condition, data) => {
  try {
    const updatedUser = await prisma.user.update({
      where: condition,
      data: data,
      select: {
        userId: true,
        firstName: true,
        lastName: true,
        createdAt: true,
        updatedAt: true,
        password:false
      }
    });
    return updatedUser;
  } catch (err) {
    console.log("Erro in updating user: ", err)
    throw err;
  }
}

const userModel = {
  registerUser,
  getUser,
  updateUser
};

export default userModel;