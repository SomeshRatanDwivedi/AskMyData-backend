import { PrismaClient } from "../generated/prisma/client.ts";
const prisma = new PrismaClient();

const getChat = async (condition) => {
  try {
    const chatHistory = await prisma.chatHistory.findMany({ where: condition, orderBy:{createdAt:"asc"} });
    return chatHistory;
  } catch (err) {
    console.log("Erro in getChat model: ", err)
    throw err;
  }
}

const saveChat = async (chat) => {
  try {
    const newChat = await prisma.chatHistory.create({
      data: chat,
    });
    return newChat;
  } catch (err) {
    console.log("Erro in newChat model: ", err)
    throw err;
  }
}

const editChat = async (condition, data) => {
  try {
    const res = await prisma.chatHistory.update({
      where: condition,
      data: data
    });
    return res;
  } catch (err) {
    console.log("Erro in editChat model: ", err)
    throw err;
  }
};


const deleteChat = async (condition) => {
  try {
    const res = await prisma.chatHistory.delete({
      where: condition
    });
    return res;
  } catch (err) {
    console.log("Erro in deleteChat model: ", err)
    throw err;
  }
}
const chatHistoryModel = {
  saveChat,
  editChat,
  deleteChat,
  getChat
}

export default chatHistoryModel;