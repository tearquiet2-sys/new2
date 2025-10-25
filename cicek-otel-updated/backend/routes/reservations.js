import express from "express";
import { dbGet, dbAll, dbRun } from "../database/db.js";
import { authenticateToken, requireUserOrAdmin } from "../middleware/auth.js";

const router = express.Router();

// Tüm rezervasyonları getir (admin)
router.get("/", authenticateToken, async (req, res) => {
  try {
    const { role } = req.user;

    if (role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Admin yetkisi gerekli",
      });
    }

    const reservations = await dbAll(`
      SELECT 
        r.*,
        u.username,
        u.email as user_email
      FROM reservations r
      LEFT JOIN users u ON r.user_id = u.id
      ORDER BY r.created_at DESC
    `);

    res.json({
      success: true,
      data: reservations,
    });
  } catch (error) {
    console.error("Get reservations error:", error);
    res.status(500).json({
      success: false,
      message: "Sunucu hatası",
    });
  }
});

// Kullanıcının rezervasyonlarını getir
router.get(
  "/user/:userId",
  authenticateToken,
  requireUserOrAdmin,
  async (req, res) => {
    try {
      const { userId } = req.params;

      const reservations = await dbAll(
        "SELECT * FROM reservations WHERE user_id = ? ORDER BY created_at DESC",
        [userId]
      );

      res.json({
        success: true,
        reservations,
      });
    } catch (error) {
      console.error("Get user reservations error:", error);
      res.status(500).json({
        success: false,
        message: "Sunucu hatası",
      });
    }
  }
);

// Yeni rezervasyon oluştur
router.post("/", authenticateToken, async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      checkIn,
      checkOut,
      guests,
      roomType,
      specialRequests,
    } = req.body;

    // Validasyon
    if (!name || !email || !checkIn || !checkOut || !guests || !roomType) {
      return res.status(400).json({
        success: false,
        message: "Gerekli alanlar eksik",
      });
    }

    // Tarih validasyonu
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (checkInDate < today) {
      return res.status(400).json({
        success: false,
        message: "Giriş tarihi bugünden önce olamaz",
      });
    }

    if (checkOutDate <= checkInDate) {
      return res.status(400).json({
        success: false,
        message: "Çıkış tarihi giriş tarihinden sonra olmalı",
      });
    }

    // Oda fiyatını al
    const roomPrice = await dbGet(
      "SELECT base_price, extra_guest_fee_rate FROM room_prices WHERE room_type = ?",
      [roomType]
    );

    if (!roomPrice) {
      return res.status(400).json({
        success: false,
        message: "Geçersiz oda tipi",
      });
    }

    // Fiyat hesapla
    const nights = Math.ceil(
      (checkOutDate - checkInDate) / (1000 * 60 * 60 * 24)
    );
    const basePrice = nights * roomPrice.base_price;
    const extraGuests = Math.max(0, guests - 2);
    const extraGuestFee =
      extraGuests *
      (roomPrice.base_price * roomPrice.extra_guest_fee_rate) *
      nights;
    const totalPrice = basePrice + extraGuestFee;

    // Rezervasyon ID oluştur
    const reservationId = `RES${Date.now()}${Math.floor(Math.random() * 1000)}`;

    // Rezervasyonu veritabanına ekle
    const result = await dbRun(
      `
      INSERT INTO reservations (
        id, user_id, name, email, phone, check_in, check_out, 
        guests, room_type, special_requests, total_price
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
      [
        reservationId,
        req.user.id,
        name,
        email,
        phone || null,
        checkIn,
        checkOut,
        guests,
        roomType,
        specialRequests || null,
        totalPrice,
      ]
    );

    // Oluşturulan rezervasyonu getir
    const newReservation = await dbGet(
      "SELECT * FROM reservations WHERE id = ?",
      [reservationId]
    );

    res.status(201).json({
      success: true,
      data: newReservation,
    });
  } catch (error) {
    console.error("Create reservation error:", error);
    res.status(500).json({
      success: false,
      message: "Sunucu hatası",
    });
  }
});

// Rezervasyon güncelle
router.put("/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { checkIn, checkOut, guests, roomType, specialRequests } = req.body;

    // Rezervasyonu bul
    const reservation = await dbGet("SELECT * FROM reservations WHERE id = ?", [
      id,
    ]);

    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: "Rezervasyon bulunamadı",
      });
    }

    // Yetki kontrolü (kendi rezervasyonu veya admin)
    if (reservation.user_id !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Bu rezervasyonu düzenleme yetkiniz yok",
      });
    }

    // Sadece pending durumundaki rezervasyonlar düzenlenebilir
    if (reservation.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: "Sadece beklemedeki rezervasyonlar düzenlenebilir",
      });
    }

    // Güncelleme verilerini hazırla
    const updateData = {};
    if (checkIn) updateData.check_in = checkIn;
    if (checkOut) updateData.check_out = checkOut;
    if (guests) updateData.guests = guests;
    if (roomType) updateData.room_type = roomType;
    if (specialRequests !== undefined)
      updateData.special_requests = specialRequests;

    // Eğer fiyat etkileyen alanlar değiştiyse fiyatı yeniden hesapla
    if (checkIn || checkOut || guests || roomType) {
      const finalCheckIn = checkIn || reservation.check_in;
      const finalCheckOut = checkOut || reservation.check_out;
      const finalGuests = guests || reservation.guests;
      const finalRoomType = roomType || reservation.room_type;

      const roomPrice = await dbGet(
        "SELECT base_price, extra_guest_fee_rate FROM room_prices WHERE room_type = ?",
        [finalRoomType]
      );

      if (roomPrice) {
        const checkInDate = new Date(finalCheckIn);
        const checkOutDate = new Date(finalCheckOut);
        const nights = Math.ceil(
          (checkOutDate - checkInDate) / (1000 * 60 * 60 * 24)
        );
        const basePrice = nights * roomPrice.base_price;
        const extraGuests = Math.max(0, finalGuests - 2);
        const extraGuestFee =
          extraGuests *
          (roomPrice.base_price * roomPrice.extra_guest_fee_rate) *
          nights;
        updateData.total_price = basePrice + extraGuestFee;
      }
    }

    updateData.updated_at = new Date().toISOString();

    // Güncelleme sorgusu oluştur
    const setClause = Object.keys(updateData)
      .map((key) => `${key} = ?`)
      .join(", ");
    const values = Object.values(updateData);
    values.push(id);

    await dbRun(`UPDATE reservations SET ${setClause} WHERE id = ?`, values);

    // Güncellenmiş rezervasyonu getir
    const updatedReservation = await dbGet(
      "SELECT * FROM reservations WHERE id = ?",
      [id]
    );

    res.json({
      success: true,
      data: updatedReservation,
    });
  } catch (error) {
    console.error("Update reservation error:", error);
    res.status(500).json({
      success: false,
      message: "Sunucu hatası",
    });
  }
});

// Rezervasyon sil
router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    // Rezervasyonu bul
    const reservation = await dbGet("SELECT * FROM reservations WHERE id = ?", [
      id,
    ]);

    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: "Rezervasyon bulunamadı",
      });
    }

    // Yetki kontrolü (kendi rezervasyonu veya admin)
    if (reservation.user_id !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Bu rezervasyonu silme yetkiniz yok",
      });
    }

    // Rezervasyonu sil
    await dbRun("DELETE FROM reservations WHERE id = ?", [id]);

    res.json({
      success: true,
      message: "Rezervasyon silindi",
    });
  } catch (error) {
    console.error("Delete reservation error:", error);
    res.status(500).json({
      success: false,
      message: "Sunucu hatası",
    });
  }
});

// Oda fiyatlarını getir
router.get("/prices", async (req, res) => {
  try {
    const prices = await dbAll("SELECT * FROM room_prices ORDER BY base_price");

    res.json({
      success: true,
      data: prices,
    });
  } catch (error) {
    console.error("Get prices error:", error);
    res.status(500).json({
      success: false,
      message: "Sunucu hatası",
    });
  }
});

export default router;
