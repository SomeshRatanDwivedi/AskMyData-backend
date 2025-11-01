import LLM from "../services/llm.service.js";
import VectorDb from "../services/vector.service.js";

const vectorDb = new VectorDb();
const llm = new LLM();
const getAnswer = async (req, res) => {
  try {
    const { question } = req.body;
    const context = await vectorDb.searchQuery(question, req.user.userId);
    const answer = await llm.answerWithContext(question, context);
    return res.status(200).json({ success: true, data:answer});
  } catch (err) {
    console.log("Error in getAnswer controller: ", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
}

const questionController = {
  getAnswer
}

export default questionController;