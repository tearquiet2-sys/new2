import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { config } from "./config.js";
import authRoutes from "./routes/auth.js";
import reservationRoutes from "./routes/reservations.js";
import adminRoutes from "./routes/admin.js";

const app = express();

// Güvenlik middleware'leri
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 dakika
  max: 100, // Her IP için 15 dakikada maksimum 100 istek
  message: {
    success: false,
    message: "Çok fazla istek gönderildi, lütfen daha sonra tekrar deneyin",
  },
});
app.use(limiter);

// CORS ayarları
app.use(
  cors({
    origin: config.corsOrigins,
    credentials: true,
  })
);

// Body parser
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "Çiçek Otel API çalışıyor",
    timestamp: new Date().toISOString(),
    version: "1.0.0",
  });
});

// API rotaları
app.use("/api/auth", authRoutes);
app.use("/api/reservations", reservationRoutes);
app.use("/api/admin", adminRoutes);

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "Endpoint bulunamadı",
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error("Server error:", err);

  res.status(500).json({
    success: false,
    message: config.nodeEnv === "production" ? "Sunucu hatası" : err.message,
  });
});

// Server'ı başlat
const PORT = config.port;
app.listen(PORT, () => {
  console.log(`🚀 Çiçek Otel API sunucusu ${PORT} portunda çalışıyor`);
  console.log(`🌐 Environment: ${config.nodeEnv}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🔗 API Base URL: http://localhost:${PORT}/api`);
});

export default app;
