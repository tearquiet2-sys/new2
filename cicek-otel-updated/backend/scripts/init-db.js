import sqlite3 from "sqlite3";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { config } from "../config.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Veritabanı bağlantısı
const db = new sqlite3.Database(config.dbPath);

// SQL şemasını oku ve çalıştır
const schemaPath = join(__dirname, "..", "database", "schema.sql");
const schema = readFileSync(schemaPath, "utf8");

console.log("Veritabanı başlatılıyor...");

db.exec(schema, (err) => {
  if (err) {
    console.error("Veritabanı hatası:", err);
    process.exit(1);
  }

  console.log("✅ Veritabanı başarıyla oluşturuldu!");
  console.log("📊 Tablolar:");
  console.log("   - users (kullanıcılar)");
  console.log("   - reservations (rezervasyonlar)");
  console.log("   - room_prices (oda fiyatları)");
  console.log("");
  console.log("🔑 Varsayılan admin girişi:");
  console.log("   Kullanıcı adı: admin");
  console.log("   Şifre: admin123");
  console.log("   E-posta: admin@cicekhotel.com");

  db.close();
});
