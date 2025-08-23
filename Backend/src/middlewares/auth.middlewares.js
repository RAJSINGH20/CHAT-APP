import jwt from "jsonwebtoken";
import User from "../models/user.models.js";

export const protectRoute = async (req, res, next) => {
  try {
    // console.log("error started")
    // console.log("error ended")
    const token = req.cookies.jwt || req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized - No Token Provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) {
      return res.status(401).json({ message: "Unauthorized - Invalid Token" });
    }

    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.status !== "active") {
      return res.status(401).json({
        message: "Unauthorized - Account deactivated",
        error: "account_inactive",
      });
    }
    req.user = user;

    next();
  } catch (error) {
    console.log("Error in protectRoute middleware: ", error.message);

    // Handle specific JWT errors
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        message: "Unauthorized - Invalid Token",
        error: "invalid_token",
      });
    }

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        message: "Unauthorized - Token Expired",
        error: "token_expired",
      });
    }

    // Generic server error for other issues
    res.status(500).json({
      message: "Internal server error",
      error: "server_error",
    });
  }
};
