import express from "express";
import {
    createChat,
    getAllChats,
    getChatById,
    sendMessage,
    renameChat,
    deleteChat,
} from "../controllers/aiChatcontroller.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/new", protect, createChat);
router.get("/", protect, getAllChats);
router.get("/:chatId", protect, getChatById);
router.post("/:chatId", protect, sendMessage);
router.put("/:chatId", protect, renameChat);
router.delete("/:chatId", protect, deleteChat);

export default router;