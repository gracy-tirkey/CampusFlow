import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  if (!process.env.JWT_SECRET) {
    console.error("❌ Missing JWT_SECRET in .env file");
    return res.status(500).json({ message: "Server configuration error" });
  }

  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {

    try {

      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.id).select("-password");

      next();

    } catch (error) {

      res.status(401).json({ message: "Not authorized" });

    }

  } else {

    res.status(401).json({ message: "No token provided" });

  }
};