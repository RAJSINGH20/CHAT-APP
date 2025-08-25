import jwt from "jsonwebtoken";

export const generateToken = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.cookie("jwt", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "devlopment", // ✅ only true in devlopment (HTTPS)
    sameSite: process.env.NODE_ENV === "devlopment" ? "strict" : "lax", // ✅ lax for localhost
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};
