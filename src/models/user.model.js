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

const getUser = async (condition) => {
  try {
    const user = await prisma.user.findUnique({
      where: condition,
    });
    return user;
  } catch (err) {
    console.log("Erro in getting user: ", err)
    throw err;
  }
}

const userModel = {
  registerUser,
  getUser
};

export default userModel;