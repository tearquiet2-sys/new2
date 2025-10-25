import express from "express";
import { dbGet, dbAll, dbRun } from "../database/db.js";
import { authenticateToken, requireAdmin } from "../middleware/auth.js";

const router = express.Router();

// Tüm admin rotaları admin yetkisi gerektirir
router.use(authenticateToken);
router.use(requireAdmin);

// Dashboard verilerini getir
router.get("/dashboard", async (req, res) => {
  try {
    // Toplam rezervasyon sayısı
    const totalReservations = await dbGet(
      "SELECT COUNT(*) as count FROM reservations"
    );

    // Onaylanmış rezervasyon sayısı
    const confirmedReservations = await dbGet(
      'SELECT COUNT(*) as count FROM reservations WHERE status = "confirmed"'
    );

    // Beklemedeki rezervasyon sayısı
    const pendingReservations = await dbGet(
      'SELECT COUNT(*) as count FROM reservations WHERE status = "pending"'
    );

    // Toplam kullanıcı sayısı
    const totalUsers = await dbGet("SELECT COUNT(*) as count FROM users");

    // Bu ayın rezervasyonları
    const thisMonthReservations = await dbGet(`
      SELECT COUNT(*) as count FROM reservations 
      WHERE strftime('%Y-%m', created_at) = strftime('%Y-%m', 'now')
    `);

    // Toplam gelir
    const totalRevenue = await dbGet(`
      SELECT SUM(total_price) as total FROM reservations 
      WHERE status = "confirmed"
    `);

    res.json({
      success: true,
      data: {
        totalReservations: totalReservations.count,
        confirmedReservations: confirmedReservations.count,
        pendingReservations: pendingReservations.count,
        totalUsers: totalUsers.count,
        thisMonthReservations: thisMonthReservations.count,
        totalRevenue: totalRevenue.total || 0,
      },
    });
  } catch (error) {
    console.error("Dashboard error:", error);
    res.status(500).json({
      success: false,
      message: "Sunucu hatası",
    });
  }
});

// Kullanıcıları getir
router.get("/users", async (req, res) => {
  try {
    const users = await dbAll(`
      SELECT 
        id, username, email, role, created_at,
        (SELECT COUNT(*) FROM reservations WHERE user_id = users.id) as reservation_count
      FROM users 
      ORDER BY created_at DESC
    `);

    res.json({
      success: true,
      data: users,
    });
  } catch (error) {
    console.error("Get users error:", error);
    res.status(500).json({
      success: false,
      message: "Sunucu hatası",
    });
  }
});

// Yeni kullanıcı oluştur
router.post("/users", async (req, res) => {
  try {
    const { username, email, password, role = "user" } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Kullanıcı adı, e-posta ve şifre gerekli",
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
    const bcrypt = await import("bcryptjs");
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Kullanıcıyı veritabanına ekle
    const result = await dbRun(
      "INSERT INTO users (username, email, password_hash, role) VALUES (?, ?, ?, ?)",
      [username, email, passwordHash, role]
    );

    res.status(201).json({
      success: true,
      data: {
        id: result.id,
        username,
        email,
        role,
      },
    });
  } catch (error) {
    console.error("Create user error:", error);
    res.status(500).json({
      success: false,
      message: "Sunucu hatası",
    });
  }
});

// Kullanıcı sil
router.delete("/users/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Kendi hesabını silmeye çalışıyorsa engelle
    if (parseInt(id) === req.user.id) {
      return res.status(400).json({
        success: false,
        message: "Kendi hesabınızı silemezsiniz",
      });
    }

    // Kullanıcıyı sil (rezervasyonlar da silinir - CASCADE)
    const result = await dbRun("DELETE FROM users WHERE id = ?", [id]);

    if (result.changes === 0) {
      return res.status(404).json({
        success: false,
        message: "Kullanıcı bulunamadı",
      });
    }

    res.json({
      success: true,
      message: "Kullanıcı silindi",
    });
  } catch (error) {
    console.error("Delete user error:", error);
    res.status(500).json({
      success: false,
      message: "Sunucu hatası",
    });
  }
});

// Rezervasyon onayla
router.put("/reservations/:id/approve", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await dbRun(
      'UPDATE reservations SET status = "confirmed", updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [id]
    );

    if (result.changes === 0) {
      return res.status(404).json({
        success: false,
        message: "Rezervasyon bulunamadı",
      });
    }

    res.json({
      success: true,
      message: "Rezervasyon onaylandı",
    });
  } catch (error) {
    console.error("Approve reservation error:", error);
    res.status(500).json({
      success: false,
      message: "Sunucu hatası",
    });
  }
});

// Rezervasyon reddet
router.put("/reservations/:id/reject", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await dbRun(
      'UPDATE reservations SET status = "cancelled", updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [id]
    );

    if (result.changes === 0) {
      return res.status(404).json({
        success: false,
        message: "Rezervasyon bulunamadı",
      });
    }

    res.json({
      success: true,
      message: "Rezervasyon reddedildi",
    });
  } catch (error) {
    console.error("Reject reservation error:", error);
    res.status(500).json({
      success: false,
      message: "Sunucu hatası",
    });
  }
});

// Tüm rezervasyonları temizle
router.delete("/reservations/clear", async (req, res) => {
  try {
    await dbRun("DELETE FROM reservations");

    res.json({
      success: true,
      message: "Tüm rezervasyonlar temizlendi",
    });
  } catch (error) {
    console.error("Clear reservations error:", error);
    res.status(500).json({
      success: false,
      message: "Sunucu hatası",
    });
  }
});

// Oda fiyatlarını güncelle
router.put("/prices", async (req, res) => {
  try {
    const { prices } = req.body;

    if (!Array.isArray(prices)) {
      return res.status(400).json({
        success: false,
        message: "Fiyatlar array formatında olmalı",
      });
    }

    // Her fiyatı güncelle
    for (const price of prices) {
      const { room_type, base_price, extra_guest_fee_rate } = price;

      if (!room_type || base_price === undefined) {
        continue; // Geçersiz fiyat verisini atla
      }

      await dbRun(
        `
        INSERT OR REPLACE INTO room_prices (room_type, base_price, extra_guest_fee_rate, updated_at)
        VALUES (?, ?, ?, CURRENT_TIMESTAMP)
      `,
        [room_type, base_price, extra_guest_fee_rate || 0.2]
      );
    }

    res.json({
      success: true,
      message: "Fiyatlar güncellendi",
    });
  } catch (error) {
    console.error("Update prices error:", error);
    res.status(500).json({
      success: false,
      message: "Sunucu hatası",
    });
  }
});

export default router;
