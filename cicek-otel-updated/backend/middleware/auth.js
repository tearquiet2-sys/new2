import jwt from "jsonwebtoken";
import { config } from "../config.js";

// JWT token doğrulama middleware'i
export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Erişim token'ı gerekli",
    });
  }

  jwt.verify(token, config.jwtSecret, (err, user) => {
    if (err) {
      return res.status(403).json({
        success: false,
        message: "Geçersiz token",
      });
    }
    req.user = user;
    next();
  });
};

// Admin yetkisi kontrolü
export const requireAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Admin yetkisi gerekli",
    });
  }
  next();
};

// Kullanıcı yetkisi kontrolü (kendi verilerine erişim)
export const requireUserOrAdmin = (req, res, next) => {
  const { userId } = req.params;
  const { id, role } = req.user;

  if (role === "admin" || id.toString() === userId) {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: "Bu verilere erişim yetkiniz yok",
    });
  }
};
