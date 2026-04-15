import Share from "../models/Share.js";
import Note from "../models/Note.js";
import Doubt from "../models/Doubt.js";
import User from "../models/User.js";
import { getIO } from "../services/socket.js";

/**
 * Create a share - send note/doubt to another user
 * @route POST /share
 * @body { itemType, itemId, recipientId, message }
 */
export const createShare = async (req, res) => {
  try {
    const { itemType, itemId, recipientId, message = "" } = req.body;
    const senderId = req.user.id;

    // Validation
    if (!itemType || !["note", "doubt"].includes(itemType)) {
      return res
        .status(400)
        .json({ message: "Invalid itemType. Must be 'note' or 'doubt'" });
    }

    if (!itemId || !recipientId) {
      return res
        .status(400)
        .json({ message: "itemId and recipientId are required" });
    }

    if (senderId === recipientId) {
      return res.status(400).json({ message: "Cannot share with yourself" });
    }

    // Verify recipient exists
    const recipient = await User.findById(recipientId);
    if (!recipient) {
      return res.status(404).json({ message: "Recipient not found" });
    }

    // Verify item exists and get title
    let itemTitle = "";
    if (itemType === "note") {
      const note = await Note.findById(itemId);
      if (!note) {
        return res.status(404).json({ message: "Note not found" });
      }
      itemTitle = note.title;
    } else {
      const doubt = await Doubt.findById(itemId);
      if (!doubt) {
        return res.status(404).json({ message: "Doubt not found" });
      }
      itemTitle = doubt.question;
    }

    // Check if already shared with this user
    const existing = await Share.findOne({
      sender: senderId,
      recipient: recipientId,
      itemId,
      itemType,
    });

    if (existing) {
      return res.status(400).json({ message: "Already shared with this user" });
    }

    // Create share
    const share = await Share.create({
      sender: senderId,
      recipient: recipientId,
      itemType,
      itemId,
      itemTitle,
      message: message.trim(),
    });

    // Populate sender info
    await share.populate("sender", "name");
    await share.populate("recipient", "name");

    // Emit real-time notification via socket
    try {
      getIO().emit("item_shared", {
        recipientId,
        share: share.toObject(),
      });
    } catch (socketError) {
      console.warn("Socket emit failed for item_shared:", socketError.message);
    }

    res.status(201).json({
      success: true,
      message: "Shared successfully",
      data: share,
    });
  } catch (error) {
    console.error("Share creation error:", error);
    res
      .status(500)
      .json({ message: error.message || "Failed to create share" });
  }
};

/**
 * Get shares received by current user
 * @route GET /share/received
 * @query { page, limit }
 */
export const getReceivedShares = async (req, res) => {
  try {
    const recipientId = req.user.id;
    const { page = 1, limit = 10 } = req.query;

    const shares = await Share.find({ recipient: recipientId })
      .populate("sender", "name email role")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Share.countDocuments({ recipient: recipientId });

    res.json({
      success: true,
      data: shares,
      total,
      hasMore: page * limit < total,
    });
  } catch (error) {
    console.error("Get received shares error:", error);
    res.status(500).json({ message: "Failed to fetch shares" });
  }
};

/**
 * Get shares sent by current user
 * @route GET /share/sent
 * @query { page, limit }
 */
export const getSentShares = async (req, res) => {
  try {
    const senderId = req.user.id;
    const { page = 1, limit = 10 } = req.query;

    const shares = await Share.find({ sender: senderId })
      .populate("recipient", "name email role")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Share.countDocuments({ sender: senderId });

    res.json({
      success: true,
      data: shares,
      total,
      hasMore: page * limit < total,
    });
  } catch (error) {
    console.error("Get sent shares error:", error);
    res.status(500).json({ message: "Failed to fetch shares" });
  }
};

/**
 * Mark share as seen
 * @route PUT /share/:shareId/seen
 */
export const markShareAsSeen = async (req, res) => {
  try {
    const { shareId } = req.params;
    const recipientId = req.user.id;

    const share = await Share.findOne({
      _id: shareId,
      recipient: recipientId,
    });

    if (!share) {
      return res.status(404).json({ message: "Share not found" });
    }

    share.seenAt = new Date();
    await share.save();

    res.json({
      success: true,
      message: "Share marked as seen",
      data: share,
    });
  } catch (error) {
    console.error("Mark as seen error:", error);
    res.status(500).json({ message: "Failed to update share" });
  }
};

/**
 * Delete a share
 * @route DELETE /share/:shareId
 */
export const deleteShare = async (req, res) => {
  try {
    const { shareId } = req.params;
    const userId = req.user.id;

    const share = await Share.findById(shareId);

    if (!share) {
      return res.status(404).json({ message: "Share not found" });
    }

    // Only sender or recipient can delete
    if (
      share.sender.toString() !== userId &&
      share.recipient.toString() !== userId
    ) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this share" });
    }

    await Share.findByIdAndDelete(shareId);

    res.json({
      success: true,
      message: "Share deleted successfully",
    });
  } catch (error) {
    console.error("Delete share error:", error);
    res.status(500).json({ message: "Failed to delete share" });
  }
};

/**
 * Get all users for share modal (exclude current user)
 * @route GET /share/users/list
 */
export const getUsersForShare = async (req, res) => {
  try {
    const currentUserId = req.user.id;
    const { search = "" } = req.query;

    const query = {
      _id: { $ne: currentUserId },
      $or: [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ],
    };

    const users = await User.find(query)
      .select("_id name email role")
      .limit(20);

    res.json({
      success: true,
      data: users,
    });
  } catch (error) {
    console.error("Get users for share error:", error);
    res.status(500).json({ message: "Failed to fetch users" });
  }
};
