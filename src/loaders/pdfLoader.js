import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";

export const loadPdf = async (pdfPath) => {
  try {
    const loader = new PDFLoader(pdfPath);
    const docs = await loader.load();
    // docs is an array of Document objects → extract text
    const fullText = docs.map(d => d.pageContent).join("\n");

    return fullText;
  } catch (err) {
    console.error("Error loading PDF:", err);
    throw err;
  }
};
