# Kullanıcı Sistemi Kullanım Kılavuzu

## Özellikler

### 1. Kullanıcı Girişi ve Kaydı

- **Giriş Yap**: Mevcut kullanıcılar kullanıcı adı ve şifre ile giriş yapabilir
- **Kayıt Ol**: Yeni kullanıcılar e-posta, kullanıcı adı ve şifre ile kayıt olabilir
- **Güvenli Kimlik Doğrulama**: JWT token tabanlı güvenli giriş sistemi

### 2. Rezervasyon Yönetimi

- **Rezervasyon Oluşturma**: Giriş yapmış kullanıcılar rezervasyonlarını doğrudan veritabanına kaydedebilir
- **Rezervasyon Görüntüleme**: Kullanıcılar kendi rezervasyonlarını listeleyebilir
- **Rezervasyon Düzenleme**: Mevcut rezervasyonları güncelleyebilir
- **Rezervasyon Silme**: İstenmeyen rezervasyonları silebilir

### 3. Kullanıcı Arayüzü

- **Responsive Tasarım**: Mobil ve masaüstü uyumlu
- **Modern UI**: Gradient renkler ve animasyonlar
- **Kolay Navigasyon**: Header menüsü ile kolay erişim

## Kullanım Adımları

### 1. Kullanıcı Kaydı

1. Ana sayfada "Giriş Yap" butonuna tıklayın
2. "Kayıt Ol" sekmesine geçin
3. Gerekli bilgileri doldurun:
   - Kullanıcı Adı
   - E-posta Adresi
   - Şifre
   - Şifre Tekrar
4. "Kayıt Ol" butonuna tıklayın

### 2. Giriş Yapma

1. Ana sayfada "Giriş Yap" butonuna tıklayın
2. Kullanıcı adı ve şifrenizi girin
3. "Giriş Yap" butonuna tıklayın

### 3. Rezervasyon Yapma

1. Giriş yaptıktan sonra ana sayfada rezervasyon formunu doldurun
2. Giriş yapmış kullanıcılar için rezervasyon otomatik olarak hesabınıza kaydedilir
3. Rezervasyon yapıldıktan sonra "Rezervasyonlarım" sayfasına yönlendirilirsiniz

### 4. Rezervasyon Yönetimi

1. Header menüsünden "Rezervasyonlarım" linkine tıklayın
2. Mevcut rezervasyonlarınızı görüntüleyin
3. "Düzenle" butonu ile rezervasyonları güncelleyin
4. "Sil" butonu ile rezervasyonları silin

## Teknik Detaylar

### API Endpoints

- `POST /api/auth/register` - Kullanıcı kaydı
- `POST /api/auth/login` - Kullanıcı girişi
- `GET /api/reservations/user/:userId` - Kullanıcı rezervasyonları
- `POST /api/reservations` - Yeni rezervasyon
- `PUT /api/reservations/:id` - Rezervasyon güncelleme
- `DELETE /api/reservations/:id` - Rezervasyon silme

### Veri Yapısı

```javascript
// Kullanıcı
{
  id: "string",
  username: "string",
  email: "string",
  password: "string" // hash'lenmiş
}

// Rezervasyon
{
  id: "string",
  userId: "string",
  name: "string",
  email: "string",
  checkIn: "date",
  checkOut: "date",
  guests: "number",
  roomType: "string",
  specialRequests: "string",
  totalPrice: "number",
  status: "string",
  createdAt: "date"
}
```

### Güvenlik

- JWT token tabanlı kimlik doğrulama
- Şifre hash'leme
- Session storage ile güvenli veri saklama
- CORS koruması

## Geliştirici Notları

### Yeni Özellik Ekleme

1. API endpoint'lerini backend'e ekleyin
2. Frontend'de API fonksiyonlarını güncelleyin
3. UI bileşenlerini oluşturun/güncelleyin
4. Routing'i güncelleyin

### Stil Güncellemeleri

- CSS dosyaları: `src/styles/` klasöründe
- Bileşen stilleri: Her bileşenin kendi CSS dosyası
- Responsive tasarım: Mobile-first yaklaşım

### Test Etme

1. Kullanıcı kaydı ve girişi test edin
2. Rezervasyon oluşturma, düzenleme ve silme test edin
3. Responsive tasarımı farklı ekran boyutlarında test edin
4. Hata durumlarını test edin

## Sorun Giderme

### Yaygın Sorunlar

1. **Giriş yapamıyorum**: Kullanıcı adı ve şifreyi kontrol edin
2. **Rezervasyon görünmüyor**: Sayfayı yenileyin veya çıkış yapıp tekrar giriş yapın
3. **Stil bozuk**: Tarayıcı cache'ini temizleyin
4. **API hatası**: Backend sunucusunun çalıştığından emin olun

### Debug

- Tarayıcı geliştirici araçlarını kullanın
- Console log'larını kontrol edin
- Network sekmesinde API isteklerini inceleyin
