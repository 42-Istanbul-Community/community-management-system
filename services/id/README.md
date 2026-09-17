# Community Management System - Identity Service

ID servisi kullanıcıların temel bilgilerini yönetmek için kullanılır. Bu servis kullanıcı doğrulaması yapmaz, ancak kullanıcıların kimlik bilgilerini ve rollerini yönetmek için gerekli API uç noktalarını sağlar.

## Uç Noktalar

### Halka açık uç noktalar:

- `GET /` - Kullanıcı detaylarını getirir
  - Gelebilecek Yanıtlar:
    - Başarılı yanıt:
      ```json
      {
        "user": {
          "id": "string",         // Kullanıcı ID'si
          "name": "string",       // Kullanıcı adı
          "role": "string",       // Kullanıcı rolü (super_admin, normal)
          "picture": "string",    // Kullanıcı profil resmi URL'si (https://example.com/user.jpg ya da /user.jpg asset servisi için)
          "created_at": "string"  // Kullanıcı oluşturulma tarihi
        }
      }
      ```
    - Başarısız Yanıt:
      ```json
      {
        "error": "string",  // Hata mesajı
        "details": "string" // Hata detayları
      }
      ```
- `GET /:userId` - Spesifik bir kullanıcıyı ID ile getirir
  - Gelebilecek Yanıtlar:
    - Başarılı yanıt:
      ```json
      {
        "user": {
          "id": "string",         // Kullanıcı ID'si
          "name": "string",       // Kullanıcı adı
          "role": "string",       // Kullanıcı rolü (super_admin, normal)
          "picture": "string",    // Kullanıcı profil resmi URL'si (https://example.com/user.jpg ya da /user.jpg asset servisi için)
          "created_at": "string"  // Kullanıcı oluşturulma tarihi
        }
      }
      ```
    - Başarısız Yanıt:
      ```json
      {
        "error": "string",  // Hata mesajı
        "details": "string" // Hata detayları
      }
      ```
- `PUT /:userId` - Spesifik bir kullanıcıyı ID ile günceller
  - Gönderilecek Parametreler:
    - `name` (string, optional) - Güncellenmiş kullanıcı adı
    - `picture` (file, optional) - Güncellenmiş kullanıcı profil resmi
    - `background_picture` (file, optional) - Güncellenmiş kullanıcı arka plan resmi
    - `role` (string, optional) - Güncellenmiş kullanıcı rolü (super_admin, normal)
  - Gelebilecek Yanıtlar:
    - Başarılı yanıt:
      ```json
      {
        "user": {
          "id": "string",         // Kullanıcı ID'si
          "name": "string",       // Kullanıcı adı ya da Yeni adı
          "role": "string",       // Kullanıcı rolü (super_admin, normal)
          "picture": "string",    // Kullanıcı profil resmi URL'si (https://example.com/user.jpg ya da /user.jpg asset servisi için) ya da Yeni URL
          "background_picture": "string", // Kullanıcı arka plan resmi URL'si (https://example.com/user.jpg ya da /user.jpg asset servisi için) ya da Yeni URL
          "created_at": "string"  // Kullanıcı oluşturulma tarihi
        }
      }
      ```
    - Başarısız Yanıt:
      ```json
      {
        "error": "string",  // Hata mesajı
        "details": "string" // Hata detayları
      }
      ```
- `GET /users` - Kullanıcıları listeler
  - Gönderilecek Parametreler:
    - `page` (number, optional) - Sayfa numarası (default: 1)
    - `limit` (number, optional) - Sayfa başına kullanıcı sayısı (default: 10)
    - `ids` (array of strings, optional) - Belirli kullanıcı ID'lerini filtrelemek için
    - `text` (string, optional) - Kullanıcı adını filtrelemek için
  - Gelebilecek Yanıtlar:
    - Başarılı yanıt:
      ```json
      {
        "users": [
          {
            "id": "string",         // Kullanıcı ID'si
            "name": "string",       // Kullanıcı adı
            "picture": "string",    // Kullanıcı profil resmi URL'si (https://example.com/user.jpg ya da /user.jpg asset servisi için)
          },
          ...
        ],
        "page": 1,          // Mevcut sayfa numarası
        "limit": 10,        // Sayfa başına kullanıcı sayısı
        "maxPage": 5,       // Toplam sayfa sayısı
        "totalCount": 50    // Toplam kullanıcı sayısı
      }
      ```
    - Başarısız Yanıt:
      ```json
      {
        "error": "string",  // Hata mesajı
        "details": "string" // Hata detayları
      }
      ```

- `DELETE /pics/:userId` - Kullanıcının resimlerini siler
  - Gönderilebilecek Parametreler: (eğer ikisi de gelmezse ikisini de siler)
    - `pic` (string, optional) - Silinecek resim türü (profile, background)
    - `back_pic` (string, optional) - Silinecek arka plan resmi türü (background)
  - Gelebilecek Yanıtlar:
    - Başarılı yanıt:
      ```json
      {
        "message": "User pictures deleted successfully"
      }
      ```
    - Başarısız Yanıt:
      ```json
      {
        "error": "string",  // Hata mesajı
        "details": "string" // Hata detayları
      }
      ```

### Servis içi uç noktalar:

- `GET /internal/:userId/role` - Kullanıcının rolünü ID ile getirir
- `POST /internal/createUser` - Yeni bir kullanıcı oluşturur
- `DELETE /internal/:userId` - Spesifik bir kullanıcıyı ID ile siler

## Kaynaklar

https://www.prisma.io/docs/orm/next
https://www.prisma.io/docs/orm/prisma-schema/overview
https://www.prisma.io/docs/orm/reference/prisma-config-reference

## Image Metadata:

- originalName: ??
- Service: ID Service
