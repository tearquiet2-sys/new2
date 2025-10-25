# Çiçek Otel - Demo Kullanım Kılavuzu

## 🚀 Hızlı Başlangıç

### 1. Projeyi Çalıştırın

```bash
# Bağımlılıkları yükle
npm install

# Development server'ı başlat
npm run dev
```

### 2. Tarayıcıda Açın

Proje `http://localhost:5173` adresinde çalışacaktır.

## 👤 Demo Kullanıcılar

### Müşteri Girişi

- **Kullanıcı Adı**: `demo_user`
- **Şifre**: Herhangi bir şifre (örn: `123456`)

### Admin Girişi

- **Kullanıcı Adı**: `admin`
- **Şifre**: Herhangi bir şifre (örn: `admin123`)

## 🎯 Demo Özellikleri

### Müşteri Paneli

- ✅ Rezervasyon oluşturma
- ✅ Rezervasyon görüntüleme
- ✅ Profil yönetimi
- ✅ Çok dilli destek (TR/EN)

### Admin Paneli

- ✅ Tüm rezervasyonları görüntüleme
- ✅ Kullanıcı yönetimi
- ✅ İletişim mesajları
- ✅ Dashboard istatistikleri

## 📝 Demo Veriler

### Önceden Tanımlanmış Rezervasyonlar

- **RES20241201001**: Standart Oda (15-18 Aralık)
- **RES20241201002**: Aile Odası (25-28 Aralık)

### Önceden Tanımlanmış Kullanıcılar

- **demo_user**: Normal kullanıcı
- **admin**: Yönetici kullanıcı

### Önceden Tanımlanmış İletişim Mesajları

- John Doe: Rezervasyon Sorgusu
- Jane Smith: Fiyat Bilgisi

## 🔄 Veri Yönetimi

### Veri Kalıcılığı

- Tüm veriler tarayıcının belleğinde saklanır
- Sayfa yenilendiğinde veriler sıfırlanır
- Yeni rezervasyonlar ve kullanıcılar geçici olarak eklenir

### Veri Sıfırlama

- Tarayıcıyı yenileyin
- Veya "Tüm Rezervasyonları Temizle" butonunu kullanın (Admin panelinde)

## 🎮 Test Senaryoları

### 1. Yeni Kullanıcı Kaydı

1. Ana sayfada "Kayıt Ol" butonuna tıklayın
2. Formu doldurun ve kayıt olun
3. Otomatik olarak giriş yapılacak

### 2. Rezervasyon Oluşturma

1. Giriş yapın
2. "Rezervasyon Yap" sayfasına gidin
3. Rezervasyon bilgilerini doldurun
4. Rezervasyonu onaylayın

### 3. Admin Paneli

1. `admin` kullanıcısı ile giriş yapın
2. Admin paneline erişin
3. Rezervasyonları ve kullanıcıları yönetin

## ⚠️ Önemli Notlar

- **Demo Modu**: Bu versiyon sadece gösterim amaçlıdır
- **Güvenlik**: Gerçek şifre kontrolü yapılmaz
- **Veri Kaybı**: Sayfa yenilendiğinde veriler kaybolur
- **Performans**: Mock verilerle sınırlıdır

## 🛠️ Geliştirici Notları

### Mock API Yapısı

- Tüm API çağrıları `src/store/api.js` dosyasında simüle edilir
- Gerçek HTTP istekleri yapılmaz
- Veriler JavaScript dizilerinde saklanır

### Yeni Özellik Ekleme

1. `api.js` dosyasında yeni endpoint ekleyin
2. Mock veri yapısını güncelleyin
3. Frontend bileşenlerini güncelleyin

## 📞 Destek

Herhangi bir sorun yaşarsanız:

1. Tarayıcı konsolunu kontrol edin
2. Sayfayı yenileyin
3. Demo kullanıcı bilgilerini kullanın

---

**Not**: Bu demo versiyonu eğitim amaçlıdır ve gerçek bir otel rezervasyon sistemi değildir.

