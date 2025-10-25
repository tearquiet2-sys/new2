import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Static dosyaları serve et
app.use(express.static(path.join(__dirname, "dist")));

// API proxy - backend'e yönlendir
app.use("/api", (req, res) => {
  // Bu production'da backend URL'inize yönlendirilecek
  res.status(503).json({
    success: false,
    message:
      "Backend API is not available in this build. Please run the backend separately.",
  });
});

// Tüm route'ları React uygulamasına yönlendir
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

app.listen(PORT, () => {
  console.log(`🚀 Frontend server running on port ${PORT}`);
  console.log(`📁 Serving static files from: ${path.join(__dirname, "dist")}`);
});
