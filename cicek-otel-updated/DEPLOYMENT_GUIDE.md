# 🚀 Hosting.com Deployment Rehberi

Bu rehber, Çiçek Otel projesini hosting.com'da yayınlamak için gerekli adımları içerir.

## 📋 Ön Gereksinimler

- Hosting.com hesabı
- Backend için ayrı hosting (Heroku, Railway, DigitalOcean vb.)
- Domain adı (opsiyonel)

## 🔧 Adım 1: Backend'i Deploy Edin

### Heroku ile Backend Deploy

1. **Heroku hesabı oluşturun** ve Heroku CLI'yi yükleyin

2. **Backend klasöründe Heroku app oluşturun:**

```bash
cd backend
heroku create cicek-otel-api
```

3. **Environment variables ayarlayın:**

```bash
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=your_super_secret_jwt_key_here
heroku config:set FRONTEND_URL=https://yourdomain.com
```

4. **Deploy edin:**

```bash
git add .
git commit -m "Deploy backend"
git push heroku main
```

5. **Veritabanını başlatın:**

```bash
heroku run npm run init-db
```

### Railway ile Backend Deploy (Alternatif)

1. Railway hesabı oluşturun
2. GitHub repository'nizi bağlayın
3. `backend/` klasörünü seçin
4. Environment variables'ları ayarlayın
5. Deploy edin

## 🌐 Adım 2: Frontend'i Build Edin

1. **API URL'ini güncelleyin:**

```bash
# src/store/api.js dosyasında
const API_BASE_URL = 'https://your-backend-url.herokuapp.com/api';
```

2. **Frontend'i build edin:**

```bash
npm run build
```

## 📁 Adım 3: Hosting.com'a Yükleyin

### Dosya Yükleme

1. **cPanel'e giriş yapın**

2. **File Manager'ı açın**

3. **public_html klasörüne gidin**

4. **Tüm dosyaları silin** (varsa)

5. **dist/ klasöründeki tüm dosyaları yükleyin:**

   - `index.html`
   - `assets/` klasörü
   - Diğer tüm dosyalar

6. **server.js dosyasını da yükleyin**

### .htaccess Dosyası Oluşturun

`public_html` klasöründe `.htaccess` dosyası oluşturun:

```apache
RewriteEngine On

# API isteklerini backend'e yönlendir
RewriteCond %{REQUEST_URI} ^/api/(.*)$
RewriteRule ^api/(.*)$ https://your-backend-url.herokuapp.com/api/$1 [P,L]

# React Router için
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]

# Gzip sıkıştırma
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/plain
    AddOutputFilterByType DEFLATE text/html
    AddOutputFilterByType DEFLATE text/xml
    AddOutputFilterByType DEFLATE text/css
    AddOutputFilterByType DEFLATE application/xml
    AddOutputFilterByType DEFLATE application/xhtml+xml
    AddOutputFilterByType DEFLATE application/rss+xml
    AddOutputFilterByType DEFLATE application/javascript
    AddOutputFilterByType DEFLATE application/x-javascript
</IfModule>

# Cache ayarları
<IfModule mod_expires.c>
    ExpiresActive on
    ExpiresByType text/css "access plus 1 year"
    ExpiresByType application/javascript "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType image/jpg "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 year"
</IfModule>
```

## 🔧 Adım 4: Domain Ayarları

### Subdomain Kullanımı (Önerilen)

1. **cPanel'de Subdomains bölümüne gidin**
2. **Yeni subdomain oluşturun:** `hotel.yourdomain.com`
3. **Document root'u public_html olarak ayarlayın**

### Ana Domain Kullanımı

1. **Domain'inizi hosting.com'a yönlendirin**
2. **DNS ayarlarını kontrol edin**

## ✅ Adım 5: Test Edin

1. **Website'inizi ziyaret edin**
2. **Rezervasyon yapmayı test edin**
3. **Admin paneline giriş yapın**
4. **Mobil uyumluluğu kontrol edin**

## 🔍 Sorun Giderme

### Yaygın Sorunlar

1. **API Bağlantı Hatası:**

   - Backend URL'inin doğru olduğunu kontrol edin
   - CORS ayarlarını kontrol edin

2. **404 Hatası:**

   - .htaccess dosyasının yüklendiğini kontrol edin
   - Rewrite modülünün aktif olduğunu kontrol edin

3. **Build Hatası:**
   - Node.js versiyonunu kontrol edin
   - Bağımlılıkları yeniden yükleyin

### Log Kontrolü

1. **cPanel'de Error Logs'u kontrol edin**
2. **Backend loglarını kontrol edin** (Heroku/Railway)

## 📊 Performans Optimizasyonu

1. **CDN kullanın** (Cloudflare önerilir)
2. **Görselleri optimize edin**
3. **Lazy loading uygulayın**
4. **Cache ayarlarını optimize edin**

## 🔒 Güvenlik

1. **HTTPS kullanın**
2. **JWT secret'ını güçlü yapın**
3. **Rate limiting uygulayın**
4. **Input validation'ı kontrol edin**

## 📞 Destek

Deployment sırasında sorun yaşarsanız:

1. **Hosting.com destek** ile iletişime geçin
2. **Backend hosting sağlayıcısı** ile iletişime geçin
3. **GitHub Issues**'da sorun bildirin

## 🎉 Tebrikler!

Projeniz başarıyla yayınlandı! Artık müşterileriniz:

- ✅ Online rezervasyon yapabilir
- ✅ Hesaplarını yönetebilir
- ✅ Rezervasyonlarını görüntüleyebilir
- ✅ Admin panelinden yönetim yapabilirsiniz

**Website URL'iniz:** `https://yourdomain.com`
**Admin Panel:** `https://yourdomain.com/login`
