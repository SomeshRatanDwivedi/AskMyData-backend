import qdrantClient from "../configs/qdrantdb.config.js";
import splitText from "../utility/textSplitter.js";
import Embed from "./embedding.service.js";
import { v4 as uuid } from "uuid";

class VectorDb {
  constructor() {
    this.client = qdrantClient;
  }
  async getOrCreateCollection(collectionName, vectorSize = 384) {
    try {
      // Check if exists
      await this.client.getCollection(collectionName);
      console.log(`✅ Collection '${collectionName}' already exists`);
      return true;
    } catch (err) {
      console.log(`⚠️ Collection '${collectionName}' not found, creating...`);
      try {
        await this.client.createCollection(collectionName, {
          vectors: { size: vectorSize, distance: "Cosine" },
        });
        console.log(`✅ Collection '${collectionName}' created`);
        return true;
      } catch (error) {
        console.log(`❌ Failed to create collection '${collectionName}'`, error);
        throw error;
      }
    }
  }

  /**
   * docText: raw text content
   * metadata: { fileId, filename, userId, ... }
   */
  async insertDocument(collectionName, docText, metadata = {}) {
    try {
      // 1️⃣ Split text into chunks
      const chunks = await splitText(docText);
      console.log(`✂️ Split into ${chunks.length} chunks`);

      // 2️⃣ Generate embeddings for chunks
      const Embedder = new Embed();
      const embeddings = await Embedder.embedDoc(chunks);

      // 3️⃣ Prepare Qdrant points
      const points = chunks.map((chunk, i) => ({
        id: uuid(),
        vector: embeddings[i],
        payload: {
          text: chunk,
          ...metadata,
        },
      }));

      // 4️⃣ Insert into Qdrant
       const res=await this.client.upsert(collectionName, {
        wait: true,
        points,
      });

      console.log(`✅ Inserted ${chunks.length} vectors into '${collectionName}'`);
      return {
        status: res.status === 'completed' ? "EMBEDDED" : "FAILED",
        qDrantIds: points.map(p => p.id)
      }

    } catch (err) {
      console.error("❌ Error inserting document:", err);
      throw err;
    }
  }
}

export default VectorDb;
