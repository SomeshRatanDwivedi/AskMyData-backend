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
        password: isPassReq,
        isAdmin:true
      }
    });
    return user;
  } catch (err) {
    console.log("Erro in getting user: ", err)
    throw err;
  }
}

const getAllUsers = async (loginUserId) => {
  try {
    const users = await prisma.user.findMany({
      where: { userId: { not: loginUserId }},
      select: {
        userId: true,
        email:true,
        firstName: true,
        lastName: true,
        createdAt: true,
        updatedAt: true,
        password: false,
        isAdmin: true,
        _count: {
          select:{files:true}
        }
      },
    });
    return users.map(user => {
      return {
        ...user,
        filesCount: user._count.files
      }
    });
  } catch (err) {
    console.log("Erro in getting all users: ", err)
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
        email:true,
        createdAt: true,
        updatedAt: true,
        password: false,
        isAdmin:true
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
  updateUser,
  getAllUsers
};

export default userModel;