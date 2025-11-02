import chatHistoryModel from "../models/chatHistory.model.js";


const getChat = async (req, res) => {
  try {
    const chatHistory = await chatHistoryModel.getChat({ userId: Number(req.user.userId) });

    const modifiedChatHistory = chatHistory.flatMap(entry => [
      {
        id: entry.id,
        createdAt: entry.createdAt,
        role: "user",
        content: entry.question
      },
      {
        id: entry.id,
        createdAt: entry.createdAt,
        role: "model",
        content: entry.answer
      }
    ]);

    return res.status(200).json({
      success: true,
      data: modifiedChatHistory
    });

  } catch (err) {
    console.log("Error in getChat controller:", err.message);
    return res.status(500).json({ success: false, message: err.message });
  }
};

const saveChat = async (req, res) => {
  try {
    const { question, answer } = req.body;
    const saveChat = await chatHistoryModel.saveChat({ question, answer, userId: req.user.userId });
    const modifiedChat ={
        id: saveChat.id,
        createdAt: saveChat.createdAt,
        role: "model",
        content: saveChat.answer
      }
    return res.status(200).json({ success: true, data: modifiedChat });
  } catch (err) {
    console.log("Error in getAnswer controller: ", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
}

const editChat = async (req, res) => {
  try {
    const editChat = await chatHistoryModel.editChat({id:req.params.id, userId:req.user.userId}, req.body);
    return res.status(200).json({ success: true, data: editChat });
  } catch (err) {
    console.log("Error in editChat model: ", err)
    throw err;
  }
};

const deleteChat = async (req, res) => {
  try {
    const deleteChat = await chatHistoryModel.deleteChat({ id: req.params.id, userId: req.user.userId });
    return res.status(200).json({ success: true, data: deleteChat });
  } catch (err) {
    console.log("Erro in deleteChat model: ", err)
    throw err;
  }
}


const chatHistoryController = {
  saveChat,
  editChat,
  deleteChat,
  getChat
}

export default chatHistoryController;