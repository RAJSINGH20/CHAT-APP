import jwt from "jsonwebtoken";

export const generateToken = (userId, res) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in .env");
  }

  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  console.log("Setting cookie...");
  res.cookie("jwt", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    httpOnly: true,                  // prevent XSS attacks
    sameSite: "strict",              // prevent CSRF
    secure: process.env.NODE_ENV !== "development", // true in production
  });
  
  console.log("Cookie set successfully");
  return token;
};
