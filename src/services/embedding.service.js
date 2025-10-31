import { HuggingFaceTransformersEmbeddings } from "@langchain/community/embeddings/huggingface_transformers";

const model = new HuggingFaceTransformersEmbeddings({
  model: "Xenova/all-MiniLM-L6-v2",
  modelConfig: { dtype: "fp32" } // explicitly set dtype
});

class Embed {
  constructor() {
    this.model = model;
  }

  async embedQuery(query) {
    try {
      if (!query || query.trim().length === 0) {
        throw new Error("Query cannot be empty");
      }
      return await this.model.embedQuery(query);
    } catch (err) {
      console.log("Error in embedQuery: ", err);
      throw err;
    }
  }

  async embedDoc(doc) {
    try {
      const docs = Array.isArray(doc) ? doc : [doc];
      return await this.model.embedDocuments(docs);
    } catch (err) {
      console.log("Error in embedDoc: ", err);
      throw err;
    }
  }
}

export default Embed;
