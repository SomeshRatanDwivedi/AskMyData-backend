import redisClient from "../configs/radis.config.js";
import userModel from "../models/user.model.js";
import LLM from "../services/llm.service.js";
import VectorDb from "../services/vector.service.js";
import { decryptMethod } from "../utility/index.js";

const vectorDb = new VectorDb();

const getUserGroqApiKey = async (userId) => {
  try {
    const user = await userModel.getUser({ userId: Number(userId) });
    return user.groqApiKey;
  } catch (err) {
    console.error("Error in getting groq api key: ", err);
    return null;
  }
}
const getAnswer = async (req, res) => {
  try {
    const { question } = req.body;
    const { userId } = req.user;
    const redisKey = `groq_api_key:${userId}`;
    let apiKey = null;

    // 1️⃣ Try Redis
    try {
      apiKey = await redisClient.get(redisKey);
    } catch { }

    // 2️⃣ Redis miss → DB fallback
    if (!apiKey) {
      console.log("Api key not found in redis")
      apiKey = await getUserGroqApiKey(userId);
      if (apiKey) {
        // Save to Redis (async but non-blocking)
        redisClient.setEx(redisKey, 3600, apiKey).catch(err =>
          console.error("Redis save failed:", err)
        );
      }
    }
    apiKey = decryptMethod(apiKey);
    const llm = new LLM(apiKey);
    const context = await vectorDb.searchQuery(question, req.user.userId);
    const answer = await llm.answerWithContext(question, context);
    return res.status(200).json({ success: true, data: answer });
  } catch (err) {
    console.log("Error in getAnswer controller: ", err);
    res.status(500).json({ success: false, message: err.message });
  }
}

const getVectorRawData = async (req, res) => {
  try {
    const { question, scoreThreshold = 0.2, topK = 4, withVector = false, withPayload = true, limit = 50 } = req.body;
    const context = await vectorDb.searchQuery(question, req.user.userId, { scoreThreshold, topK, withVector, withPayload, limit, rawData: true });
    return res.status(200).json({ success: true, data: context });
  } catch (err) {
    console.log("Error in getAnswer controller: ", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
}
const questionController = {
  getAnswer,
  getVectorRawData
}

export default questionController;