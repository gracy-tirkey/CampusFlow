import AIChat from "../models/AIChat.js";
import { generateAIResponse } from "../services/aiService.js";

// 🔥 CREATE NEW CHAT
export const createChat = async (req, res) => {
  try {
    const chat = await AIChat.create({
      userId: req.user.id,
      title: "New Chat",
      messages: [],
    });

    res.status(201).json({
      success: true,
      message: "Chat created successfully",
      data: chat,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message || "Error creating chat",
    });
  }
};

// 🔥 GET ALL CHATS
export const getAllChats = async (req, res) => {
  try {
    const chats = await AIChat.find({ userId: req.user.id }).sort({
      updatedAt: -1,
    });

    res.status(200).json({
      success: true,
      message: "Chats retrieved successfully",
      data: chats,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message || "Error fetching chats",
    });
  }
};

// 🔥 GET SINGLE CHAT
export const getChatById = async (req, res) => {
  try {
    const chat = await AIChat.findById(req.params.chatId);

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: "Chat not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Chat retrieved successfully",
      data: chat,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message || "Error fetching chat",
    });
  }
};

// 🔥 SEND MESSAGE (CORE LOGIC)
export const sendMessage = async (req, res) => {
  try {
    const { message } = req.body;
    const { chatId } = req.params;

    const chat = await AIChat.findById(chatId);

    if (!chat) return res.status(404).json({ error: "Chat not found" });

    // add user message
    chat.messages.push({ sender: "user", text: message });

    // 🔥 Auto-title (first message)
    if (chat.messages.length === 1) {
      chat.title = message.slice(0, 30);
    }

    // 🔥 Context memory
    const context = chat.messages
      .slice(-6)
      .map((m) => `${m.sender}: ${m.text}`)
      .join("\n");

    const prompt = `
You are an AI tutor.

Conversation:
${context}

User: ${message}

Respond clearly. Use markdown formatting.
`;

    const aiReply = await generateAIResponse(prompt);

    chat.messages.push({ sender: "ai", text: aiReply });

    await chat.save();

    res.status(200).json({
      success: true,
      message: "Message sent successfully",
      data: {
        reply: aiReply,
        messages: chat.messages,
      },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message || "Error sending message",
    });
  }
};

// 🔥 RENAME CHAT
export const renameChat = async (req, res) => {
  try {
    const { title } = req.body;

    const chat = await AIChat.findByIdAndUpdate(
      req.params.chatId,
      { title },
      { new: true },
    );

    res.json(chat);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 🔥 DELETE CHAT
export const deleteChat = async (req, res) => {
  try {
    await AIChat.findByIdAndDelete(req.params.chatId);
    res.json({ message: "Chat deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
