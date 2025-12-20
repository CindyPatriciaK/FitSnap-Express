import jwt from "jsonwebtoken";

export const authenticateTokenMiddleware = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // ambil token setelah 'Bearer'

  if (!token) {
    return res.status(401).json({ message: "Token tidak ditemukan" });
  }

  jwt.verify(token, process.env.APP_JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Token tidak valid" });
    }

    console.log("✅ TOKEN PAYLOAD:", user); // ← ini bantu lihat isi token

    req.user = user; // inject payload ke req.user
    next();
  });
};