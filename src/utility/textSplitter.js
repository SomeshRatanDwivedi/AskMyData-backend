import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
const splitter = new RecursiveCharacterTextSplitter({ chunkSize: 800, chunkOverlap: 100 })
const splitText = async (text) => {
  try {
    return await splitter.splitText(text);
  } catch (err) {
    console.log("Error in splitText: ", err)
  }
}


export default splitText;