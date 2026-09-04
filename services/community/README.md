# Community Service

Komuniti servisi, kullanıcıların topluluklarla etkileşim kurmalarını ve bu topluluklarla ilgili bilgileri yönetmelerini sağlar.

## Uç noktalar

### Halka açık uç noktalar

- `GET /communities` - Bütün toplulukları listele burda filtreleme ve sayfalama yapılabilir
  - Gelebilecek Yanıtlar:
    - Başarılı Yanıt:

    ```json
    {
        "communities": [
            {
                "id": "string",                         // Topluluk ID'si
                "name": "string",                       // Topluluk adı
                "slug": "string",                       // Topluluk slug'ı
                "description": "string",                // Topluluk açıklaması
                "rules_path": "string",                 // Topluluk kurallarının bulunduğu dosya yolu
                "visibility": "public | private",       // Topluluk görünürlüğü
                "access": "open | restricted | closed", // Topluluk erişim durumu
                "status": "active | inactive",          // Topluluk durumu
                "created_at": "string",                 // Topluluk oluşturulma tarihi
                "tags": ["string", "string", ...]       // Topluluk etiketleri
            },
            ...
        ]
    }
    ```

    - Başarısız Yanıt:

    ```json
    {
        "error": "string"                   // Hata mesajı, örneğin veritabanı hatası veya geçersiz parametreler.
        "details": "string" || undefined    // Hata detayları, örneğin hangi parametrenin hatalı olduğu veya eksik olduğu.
    }
    ```

- `GET /communityRequests` - Role göre Topluluk isteklerini listeler (sadece super_admin ve topluluk isteği sahibi görebilir)
  - Gelebilecek Yanıtlar:
    - Başarılı Yanıt:
      ```json
      {
          "communityRequests": [
              {
                  "id": "string",                             // Topluluk isteği ID'si
                  "name": "string",                           // Topluluk adı
                  "status": "pending | approved | rejected",  // Topluluk isteği durumu
                  "user_id": "string",                        // Topluluk isteğini oluşturan kullanıcı ID'si
                  "created_at": "string",                     // Topluluk isteği oluşturulma tarihi
                  "rules_path": "string",                     // Topluluk kurallarının bulunduğu dosya yolu
                  "description": "string",                    // Topluluk açıklaması
                  "message": "string",                        // Topluluk isteği ile ilgili mesaj
                  "tags": ["string", "string", ...],          // Topluluk isteği ile ilgili etiketler
                  "access": "open | restricted | closed",     // Topluluk erişim durumu
                  "visibility": "public | private",           // Topluluk görünürlüğü
                  "reviewed_by": "string" || null,            // Topluluk isteğini inceleyen kullanıcı ID'si
                  "reviewed_at": "string" || null             // Topluluk isteğinin incelenme tarihi
              },
              ...
          ]
      }
      ```
    - Başarısız Yanıt:
      ```json
      {
          "error": "string"                   // Hata mesajı, örneğin veritabanı hatası veya geçersiz parametreler.
          "details": "string" || undefined    // Hata detayları, örneğin hangi parametrenin hatalı olduğu veya eksik olduğu.
      }
      ```

- `GET /communities/:slug` - Spesifik bir topluluğu slug ile getirir
  - Gelebilecek Yanıtlar:
    - Başarılı Yanıt:
      ```json
      {
          "community":{
              "id": "string",                         // Topluluk ID'si
              "name": "string",                       // Topluluk adı
              "slug": "string",                       // Topluluk slug'ı
              "description": "string",                // Topluluk açıklaması
              "rules_path": "string",                 // Topluluk kurallarının bulunduğu dosya yolu
              "visibility": "public | private",       // Topluluk görünürlüğü
              "access": "open | restricted | closed", // Topluluk erişim durumu
              "status": "active | inactive",          // Topluluk durumu
              "created_at": "string",                 // Topluluk oluşturulma tarihi
              "tags": ["string", "string", ...]       // Topluluk etiketleri
          }
      }
      ```
    - Başarısız Yanıt:
      ```json
      {
          "error": "string",                  // Hata mesajı, örneğin topluluk bulunamadı veya geçersiz slug.
          "details": "string" || undefined    // Hata detayları, örneğin hangi parametrenin hatalı olduğu veya eksik olduğu.
      }
      ```

- `PUT /communities/:slug` - Spesifik bir topluluğu günceller
  - Gelebilecek Yanıtlar:
    - Başarılı Yanıt:
      ```json
      {
          "community":{                               // Güncellenmiş topluluk bilgileri
              "id": "string",                         // Topluluk ID'si
              "name": "string",                       // Topluluk adı
              "slug": "string",                       // Topluluk slug'ı
              "description": "string",                // Topluluk açıklaması
              "rules_path": "string",                 // Topluluk kurallarının bulunduğu dosya yolu
              "visibility": "public | private",       // Topluluk görünürlüğü
              "access": "open | restricted | closed", // Topluluk erişim durumu
              "status": "active | inactive",          // Topluluk durumu
              "created_at": "string",                 // Topluluk oluşturulma tarihi
              "tags": ["string", "string", ...]       // Topluluk etiketleri
          }
      }
      ```
    - Başarısız Yanıt:
      ```json
      {
          "error": "string",                  // Hata mesajı, örneğin topluluk bulunamadı veya geçersiz slug.
          "details": "string" || undefined    // Hata detayları, örneğin hangi parametrenin hatalı olduğu veya eksik olduğu.
      }
      ```

- `POST /createCommunity` - Yeni bir topluluk için istek oluşturur
  - Gelebilecek Yanıtlar:
    - Başarılı Yanıt:
      ```json
      {
          "communityRequest":{
              "id": "string",                             // Topluluk isteği ID'si
              "name": "string",                           // Topluluk adı
              "status": "pending | approved | rejected",  // Topluluk isteği durumu
              "user_id": "string",                        // Topluluk isteğini oluşturan kullanıcı ID'si
              "created_at": "string",                     // Topluluk isteği oluşturulma tarihi
              "rules_path": "string",                     // Topluluk kurallarının bulunduğu dosya yolu
              "description": "string",                    // Topluluk açıklaması
              "message": "string",                        // Topluluk isteği ile ilgili mesaj
              "tags": ["string", "string", ...],          // Topluluk isteği ile ilgili etiketler
              "access": "open | restricted | closed",     // Topluluk erişim durumu
              "visibility": "public | private",           // Topluluk görünürlüğü
              "reviewed_by": "string" || null,            // Topluluk isteğini inceleyen kullanıcı ID'si
              "reviewed_at": "string" || null             // Topluluk isteğinin incelenme tarihi
          }
      }
      ```
    - Başarısız Yanıt:
      ```json
      {
          "error": "string",                  // Hata mesajı, örneğin topluluk isteği oluşturulamadı veya geçersiz parametreler.
          "details": "string" || undefined    // Hata detayları, örneğin hangi parametrenin hatalı olduğu veya eksik olduğu.
      }
      ```

- `GET /tags` - Tüm etiketleri listeler
  - Gelebilecek Yanıtlar:
    - Başarılı Yanıt:
      ```json
      {
          "tags": [
              {
                  "id": "string",         // Etiket ID'si
                  "name": "string",       // Etiket adı
              },
              ...
          ]
      }
      ```
    - Başarısız Yanıt:
      ```json
      {
          "error": "string",                  // Hata mesajı, örneğin etiketler getirilemedi veya veritabanı hatası.
          "details": "string" || undefined    // Hata detayları, örneğin hangi parametrenin hatalı olduğu veya eksik olduğu.
      }
      ```

### Servis içi uç noktalar

- `POST /internal/communities` - Topluluk isteklerinin kabul ya da reddedilmesi için kullanılır
- `DELETE /internal/communities/:slug` - Spesifik bir topluluğu siler
- `DELETE /internal/user/:userid` - Spesifik bir kullanıcıyı siler
- `GET /internal/communities/:slug` - Spesifik bir topluluğu slug ile getirir

## Membership Servisinden istenen uç noktalar

- `GET /internal/userRole/:userid/:communityid` - Kullanıcının topluluk içindeki rolünü getirir
- `GET /internal/userCommunities/:userid` - Kullanıcının üye olduğu toplulukları getirir
- `GET /internal/moderatorPermissions/:communityId` - Topluluk içindeki moderatörlerin sahip olduğu izinleri getirir

## Image Metadata:

- originalName: ??
- Service: Community Service
- CommunitySlug: slug,
