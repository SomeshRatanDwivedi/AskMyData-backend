import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();


const saveFile = async (fileInfo) => {
  try {
    const newFile = await prisma.userFiles.create({
      data: fileInfo,
    });
    return newFile;
  } catch (err) {
    console.log("Erro in saveFile model: ", err)
    throw err;
  }
}

const getFiles = async (condition, select) => {
  try {
    const newFile = await prisma.userFiles.findMany({ where: condition, select, orderBy: { createdAt: "desc" } });
    return newFile;
  } catch (err) {
    console.log("Erro in getFiles model: ", err)
    throw err;
  }
}

const updateFile = async (condition, data) => {
  try {
    const res = await prisma.userFiles.update({
      where: condition,
      data: data,
    });
    return res;
  } catch (err) {
    console.log("Erro in updateFile model: ", err)
    throw err;
  }
}

const deleteFile = async (condition, select) => {
  try {
    const res = await prisma.userFiles.delete({
      where: condition,
      select
    });
    return res;
  } catch (err) {
    console.log("Erro in deleteFile model: ", err)
    throw err;
  }
}



const fileModel = {
  saveFile,
  getFiles,
  updateFile,
  deleteFile
}

export default fileModel;