import VectorDb from "../services/vector.service.js";

const vectorDb = new VectorDb();

const getAnswer = async (req, res) => {
  try {
    const { question } = req.body;
    const data = await vectorDb.searchQuery(question, req.user.userId);
    return res.status(200).json({ success: true, data});
  } catch (err) {
    console.log("Error in getAnswer controller: ", err);
    res.status(500).json({ success: false, message: "Search Failed" });
  }
}

const questionController = {
  getAnswer
}

export default questionController;