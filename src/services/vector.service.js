import qdrantClient from "../configs/qdrantdb.config.js";
import splitText from "../utility/textSplitter.js";
import Embed from "./embedding.service.js";
import { v4 as uuid } from "uuid";
const Embedder = new Embed();
class VectorDb {
  constructor() {
    this.client = qdrantClient;
    this.collectionName = 'user_files';
    this.embeder = Embedder;
  }
  async getOrCreateCollection(vectorSize = 384) {
    try {
      // ✅ 1. Check if collection exists
      await this.client.getCollection(this.collectionName);
      console.log(`✅ Collection '${this.collectionName}' already exists`);
    } catch (err) {
      // ✅ 2. Create collection
      console.log(`⚠️ Collection '${this.collectionName}' not found, creating...`);

      await this.client.createCollection(this.collectionName, {
        vectors: { size: vectorSize, distance: "Cosine" },
      });

      console.log(`✅ Collection '${this.collectionName}' created`);
    }

    // ✅ 3. Ensure payload index exists for userId
    try {
      await this.client.createPayloadIndex(this.collectionName, {
        field_name: "userId",
        field_schema: "integer",
      });

      console.log(`✅ Payload index on 'userId' created`);
    } catch (indexErr) {
      if (
        indexErr.response?.data?.status?.error?.includes("already exists") ||
        indexErr.message?.includes("already exists")
      ) {
        console.log(`ℹ️ Payload index on 'userId' already exists`);
      } else {
        console.log(`❌ Failed creating payload index on 'userId'`, indexErr);
      }
    }

    return true;
  }


  /**
   * docText: raw text content
   * metadata: { fileId, filename, userId, ... }
   */
  async insertDocument(docText, metadata = {}) {
    try {
      // 1️⃣ Split text into chunks
      const chunks = await splitText(docText);
      console.log(`✂️ Split into ${chunks.length} chunks`);

      // 2️⃣ Generate embeddings for chunks
      const embeddings = await this.embeder.embedDoc(chunks);

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
      const res = await this.client.upsert(this.collectionName, {
        wait: true,
        points,
      });

      console.log(`✅ Inserted ${chunks.length} vectors into '${this.collectionName}'`);
      return {
        status: res.status === 'completed' ? "EMBEDDED" : "FAILED",
        qDrantIds: points.map(p => p.id)
      }

    } catch (err) {
      console.error("❌ Error inserting document:", err);
      throw err;
    }
  }

  async searchQuery(query, userId, options={}) {
    try {
      const {scoreThreshold = 0.2, topK = 4, withVector=false, withPayload=true, limit=50, rawData=false} = options;
      const embeddedQuery = await this.embeder.embedQuery(query);
      const results = await this.client.search(this.collectionName, {
        vector: embeddedQuery,
        filter: {
          must: [
            { key: "userId", match: { value: userId } }
          ]
        },
        limit: limit,
        score_threshold: scoreThreshold,
        with_payload: withPayload,
        with_vector:withVector
      });
      //Slicing topK elements only
      const slicedRes=results.slice(0,topK);
      const context = slicedRes.map(r => r.payload.text).join("\n\n");
      return rawData?slicedRes:context;
    } catch (err) {
      console.log("Error in searchQuery: ", err);
      throw err;
    }
  }

}

export default VectorDb;
