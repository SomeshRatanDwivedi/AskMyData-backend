import { PrismaClient } from "../generated/prisma/client.ts";
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
    const newFile = await prisma.userFiles.findMany({where: condition, select});
    return newFile;
  } catch (err) {
    console.log("Erro in getFiles model: ", err)
    throw err;
  }
}




const fileModel = {
  saveFile,
  getFiles
}

export default fileModel;