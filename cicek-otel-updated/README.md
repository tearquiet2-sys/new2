# Çiçek Otel Rezervasyon Sistemi

Modern, responsive ve veritabanı destekli otel rezervasyon sistemi.

## 🚀 Özellikler

- **Kullanıcı Yönetimi**: Kayıt olma, giriş yapma, profil yönetimi
- **Rezervasyon Sistemi**: Online rezervasyon oluşturma, düzenleme, silme
- **Admin Paneli**: Rezervasyon yönetimi, kullanıcı yönetimi, dashboard
- **Çok Dilli Destek**: Türkçe ve İngilizce
- **Responsive Tasarım**: Mobil ve desktop uyumlu
- **Gerçek Zamanlı Veri**: SQLite veritabanı ile veri saklama

## 🛠️ Teknolojiler

### Frontend

- React 18
- React Router DOM
- Vite
- CSS3

### Backend

- Node.js
- Express.js
- SQLite3
- JWT Authentication
- bcryptjs (şifre hashleme)

## 📦 Kurulum

### 1. Projeyi klonlayın

```bash
git clone <repository-url>
cd cicek-otel-updated
```

### 2. Bağımlılıkları yükleyin

```bash
npm run setup
```

### 3. Veritabanını başlatın

```bash
npm run backend:init
```

### 4. Geliştirme modunda çalıştırın

**Backend'i başlatın:**

```bash
npm run backend:dev
```

**Frontend'i başlatın (yeni terminal):**

```bash
npm run dev
```

## 🌐 Erişim

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000/api
- **Health Check**: http://localhost:3000/health

## 👤 Varsayılan Hesaplar

### Admin Hesabı

- **Kullanıcı Adı**: admin
- **Şifre**: admin123
- **E-posta**: admin@cicekhotel.com

## 📱 Kullanım

### Müşteri İşlemleri

1. Ana sayfadan "Rezervasyon Yap" butonuna tıklayın
2. Giriş yapın veya kayıt olun
3. Rezervasyon formunu doldurun
4. Rezervasyonlarınızı "Rezervasyonlarım" sayfasından yönetin

### Admin İşlemleri

1. "/login" sayfasından admin girişi yapın
2. Admin panelinden tüm rezervasyonları görüntüleyin
3. Rezervasyonları onaylayın/reddedin
4. Kullanıcıları yönetin

## 🚀 Production Deployment

### Hosting.com'a Yükleme

1. **Frontend'i build edin:**

```bash
npm run build
```

2. **Backend'i ayrı bir sunucuda çalıştırın** (örn: Heroku, Railway, DigitalOcean)

3. **Frontend dosyalarını hosting.com'a yükleyin:**

   - `dist/` klasöründeki tüm dosyaları public_html klasörüne yükleyin
   - `server.js` dosyasını da yükleyin

4. **Environment variables'ları ayarlayın:**
   - Backend URL'inizi `src/store/api.js` dosyasında güncelleyin

### Backend Deployment (Önerilen Platformlar)

- **Heroku**: `backend/` klasörünü ayrı bir Heroku app olarak deploy edin
- **Railway**: Backend'i Railway'e deploy edin
- **DigitalOcean**: VPS'te Node.js uygulaması olarak çalıştırın

## 📁 Proje Yapısı

```
cicek-otel-updated/
├── backend/                 # Backend API
│   ├── routes/             # API routes
│   ├── database/           # Veritabanı dosyaları
│   ├── middleware/         # Middleware'ler
│   └── server.js          # Backend server
├── src/                    # Frontend kaynak kodları
│   ├── routes/            # React sayfaları
│   ├── ui/                # UI bileşenleri
│   ├── store/             # API ve state yönetimi
│   └── styles/            # CSS dosyaları
├── dist/                   # Build edilmiş frontend
├── server.js              # Frontend server
└── package.json           # Proje bağımlılıkları
```

## 🔧 Geliştirme

### Yeni Özellik Ekleme

1. Backend'de yeni route'lar ekleyin (`backend/routes/`)
2. Frontend'de API çağrıları ekleyin (`src/store/api.js`)
3. UI bileşenlerini güncelleyin

### Veritabanı Değişiklikleri

1. `backend/database/schema.sql` dosyasını güncelleyin
2. `npm run backend:init` komutunu çalıştırın

## 📞 Destek

Herhangi bir sorun yaşarsanız:

1. GitHub Issues'da sorun bildirin
2. Dokümantasyonu kontrol edin
3. Log dosyalarını inceleyin

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.
