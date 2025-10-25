// Backend Configuration
export const config = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || "development",
  jwtSecret:
    process.env.JWT_SECRET ||
    "your_super_secret_jwt_key_here_change_in_production",
  dbPath: process.env.DB_PATH || "./database/hotel.db",
  frontendUrl: process.env.FRONTEND_URL || "http://localhost:5173",
  corsOrigins: [
    "http://localhost:5173",
    "http://localhost:3000",
    "https://yourdomain.com", // Production domain'inizi buraya ekleyin
  ],
};
