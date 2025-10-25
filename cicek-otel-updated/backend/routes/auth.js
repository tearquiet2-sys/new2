import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { dbGet, dbRun } from "../database/db.js";
import { config } from "../config.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

// Kullanıcı girişi
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Kullanıcı adı ve şifre gerekli",
      });
    }

    // Kullanıcıyı veritabanından bul
    const user = await dbGet(
      "SELECT * FROM users WHERE username = ? OR email = ?",
      [username, username]
    );

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Geçersiz kullanıcı adı veya şifre",
      });
    }

    // Şifre kontrolü
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: "Geçersiz kullanıcı adı veya şifre",
      });
    }

    // JWT token oluştur
    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
      config.jwtSecret,
      { expiresIn: "24h" }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Sunucu hatası",
    });
  }
});

// Kullanıcı kaydı
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Tüm alanlar gerekli",
      });
    }

    // Kullanıcı adı ve e-posta kontrolü
    const existingUser = await dbGet(
      "SELECT id FROM users WHERE username = ? OR email = ?",
      [username, email]
    );

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Bu kullanıcı adı veya e-posta zaten kullanılıyor",
      });
    }

    // Şifreyi hashle
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Kullanıcıyı veritabanına ekle
    const result = await dbRun(
      "INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)",
      [username, email, passwordHash]
    );

    // JWT token oluştur
    const token = jwt.sign(
      {
        id: result.id,
        username,
        email,
        role: "user",
      },
      config.jwtSecret,
      { expiresIn: "24h" }
    );

    res.status(201).json({
      success: true,
      token,
      user: {
        id: result.id,
        username,
        email,
        role: "user",
      },
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({
      success: false,
      message: "Sunucu hatası",
    });
  }
});

// Kullanıcı bilgilerini getir
router.get("/me", authenticateToken, async (req, res) => {
  try {
    const user = await dbGet(
      "SELECT id, username, email, role, created_at FROM users WHERE id = ?",
      [req.user.id]
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Kullanıcı bulunamadı",
      });
    }

    res.json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({
      success: false,
      message: "Sunucu hatası",
    });
  }
});

// Çıkış yapma (token'ı geçersiz kılmak için client-side'da silinir)
router.post("/logout", authenticateToken, (req, res) => {
  res.json({
    success: true,
    message: "Başarıyla çıkış yapıldı",
  });
});

export default router;
