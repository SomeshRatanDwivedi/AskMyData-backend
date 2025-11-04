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
        email:true,
        firstName: true,
        lastName: true,
        createdAt: true,
        updatedAt: true,
        password: isPassReq,
        isAdmin: true,
        isActive: true,
        groqApiKey: true,
      }
    });
    return user;
  } catch (err) {
    console.log("Erro in getting user: ", err)
    throw err;
  }
}

const getAllUsers = async () => {
  try {
    const users = await prisma.user.findMany({
      select: {
        userId: true,
        email:true,
        firstName: true,
        lastName: true,
        createdAt: true,
        updatedAt: true,
        password: false,
        isAdmin: true,
        isActive: true,
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
        email:true,
        firstName: true,
        lastName: true,
        email:true,
        createdAt: true,
        updatedAt: true,
        password: false,
        isAdmin: true,
        isActive: true,
        groqApiKey:true
      }
    });
    return updatedUser;
  } catch (err) {
    console.log("Erro in updating user: ", err)
    throw err;
  }
}

const deleteUser = async (condition) => {
  try {
    const deletedUser = await prisma.user.delete({
      where: condition,
    });
    return deletedUser;
  } catch (err) {
    console.log("Erro in deleting user: ", err)
    throw err;
  }
}
const userModel = {
  registerUser,
  getUser,
  updateUser,
  getAllUsers,
  deleteUser
};

export default userModel;