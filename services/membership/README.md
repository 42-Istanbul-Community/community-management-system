# Membership Service

Membership servisi, kullanıcıların topluluklara katılma isteklerini yönetmelerini ve topluluk üyeliklerini kontrol etmelerini sağlar.

## Uç Noktalar

### Açık Uç Noktalar (Kullanıcılar için)

- `POST /communityRequests` - Yeni bir topluluk üyelik isteği oluşturur (Eğer topluluk açık ise direkt olarak üye olur, kısıtlı ise moderatör onayı bekler)
  - Gelebilecek Yanıtlar:
    - Başarılı Yanıt:
      - Topluluk açık ise:
        ```json
        {
          "id": "string",           // Oluşturulan üyelik isteğinin ID'si
          "community_id": "string", // İlgili topluluk ID'si
          "user_id": "string",      // Üyelik isteğini yapan kullanıcı ID'si
          "role": "string",         // Kullanıcının topluluk içindeki rolü (varsayılan olarak "member")
          "joined_at": "string"     // Kullanıcının topluluğa katıldığı tarih
        }
        ```
      - Topluluk kısıtlı ise:
        ```json
        {
            "id": "string",                     // Oluşturulan üyelik isteğinin ID'si
            "community_id": "string",           // İlgili topluluk ID'si
            "user_id": "string",                // Üyelik isteğini yapan kullanıcı ID'si
            "status": "pending",                // Üyelik isteğinin durumu (kabul bekliyor)
            "message": "string" || null,        // Kullanıcı tarafından eklenen mesaj
            "created_at": "string",             // Üyelik isteğinin oluşturulduğu tarih
            "reviewed_at": "string" || null,    // Üyelik isteğinin incelendiği tarih
            "reviewed_by": "string" || null,    // Üyelik isteğini inceleyen moderatörün ID'si
        }
        ```
    - Başarısız Yanıt:
      ```json
      {
          "error": "string",
          "details": "string" || undefined // Hata mesajı, örneğin: Kullanıcı zaten topluluk üyesi olabilir, topluluk bulunamayabilir veya üyelik isteği zaten mevcut olabilir.
      }
      ```

- `GET /members/:communityId` - Komünite üyelerini listeler, sayfalama ve filtreleme yapılabilir
  - Gelebilecek Yanıtlar:
    - Başarılı Yanıt:
      ```json
      {
          "members": [
              {
                  "id": "string",           // Üyenin ID'si
                  "user_id": "string",      // Üyenin kullanıcı ID'si
                  "community_id": "string", // Üyenin topluluk ID'si
                  "role": "string",         // Üyenin topluluk içindeki rolü
                  "joined_at": "string"     // Üyenin topluluğa katıldığı tarih
              }
              ...
          ]
      }
      ```
    - Başarısız Yanıt:
      ```json
      {
          "error": "string"                 // Hata mesajı, örneğin: Topluluk bulunamayabilir veya kullanıcı yetkisi olmayabilir.
          "details": "string" || undefined  // Hata detayları, örneğin: Kullanıcı yetkisi yok veya topluluk bulunamadı.
      }
      ```

- `GET /communityRequests/:communityId` - Belirli bir topluluk için üyelik isteklerini listeler
  - Gelebilecek Yanıtlar:
    - Başarılı Yanıt:
      ```json
      {
          "requests": [
              {
                  "id": "string",                     // Üyelik isteğinin ID'si
                  "user_id": "string",                // Üyelik isteğini yapan kullanıcı ID'si
                  "community_id": "string",           // Üyelik isteğinin başvurulduğu topluluk ID'si
                  "status": "string",                 // Üyelik isteğinin durumu (pending, approved, rejected)
                  "message": "string" || null,        // Kullanıcı tarafından eklenen mesaj
                  "created_at": "string",             // Üyelik isteğinin oluşturulduğu tarih
                  "reviewed_at": "string" || null,    // Üyelik isteğinin incelendiği tarih
                  "reviewed_by": "string" || null     // Üyelik isteğini inceleyen moderatörün ID'si
              }
              ...
          ]
      }
      ```

  - Başarısız Yanıt:
    ```json
    {
        "error": "string",                  // Hata mesajı, örneğin: Topluluk bulunamayabilir veya kullanıcı yetkisi olmayabilir.
        "details": "string" || undefined    // Hata detayları, örneğin: Kullanıcı yetkisi yok veya topluluk bulunamadı.
    }
    ```

- `PUT /communityRequests/resolve` - Belirli bir üyelik isteğini kabul eder veya reddeder
  - Gelebilecek Yanıtlar:
    - Başarılı Yanıt:
      ```json
      {
          "successfulRequests":[
              {
                  "id": "string",                     // Başarılı bir şekilde işlenen üyelik isteğinin ID'si
                  "user_id": "string",                // Üyelik isteğini yapan kullanıcı ID'si
                  "community_id": "string",           // Üyelik isteğinin başvurulduğu topluluk ID'si
                  "status": "string",                 // Üyelik isteğinin durumu (approved, rejected)
                  "message": "string" || null,        // Kullanıcı tarafından eklenen mesaj
                  "created_at": "string",             // Üyelik isteğinin oluşturulduğu tarih
                  "reviewed_at": "string" || null,    // Üyelik isteğinin incelendiği tarih
                  "reviewed_by": "string" || null     // Üyelik isteğini inceleyen moderatörün ID'si
              },
              ...
          ],
          "failedRequests": undefined || [
              {
                  "requestId": "string",  // Üyeliği tamamlanamayan isteğin üyelik isteği ID'si
                  "error": "string",      // Hata mesajı, örneğin: Üyelik isteği bulunamayabilir veya kullanıcı yetkisi olmayabilir.
              },
              ...
          ]
      }
      ```
    - Başarısız Yanıt:
      ```json
      {
          "error": "string",                    // Hata mesajı, örneğin: Üyelik isteği bulunamayabilir veya kullanıcı yetkisi olmayabilir.
          "details": "string" || undefined      // Hata detayları, örneğin: Kullanıcı yetkisi yok veya üyelik isteği bulunamadı.
      }
      ```

- `GET /moderatorPermissions/:communityId` - Belirli bir topluluk için moderatör izinlerini getirir
    - Gelebilecek Yanıtlar:
      - Başarılı Yanıt:
        ```json
        {
            "id": "string",                 // Moderatör izinlerinin ID'si
            "community_id": "string",       // Topluluk ID'si
            "permission": ["string", ...]   // Moderatör izinlerinin listesi
        }
        ```
      - Başarısız Yanıt:
        ```json
        {
            "error": "string",                  // Hata mesajı, örneğin: Topluluk bulunamayabilir veya kullanıcı yetkisi olmayabilir.
            "details": "string" || undefined    // Hata detayları, örneğin: Kullanıcı yetkisi yok veya topluluk bulunamadı.
        }
        ```

- `PUT /moderatorPermissions/:communityId` - Belirli bir topluluk için moderatör izinlerini günceller
    - Gelebilecek Yanıtlar:
      - Başarılı Yanıt:
        ```json
        {                                   // Başarılı bir şekilde güncellenmiş moderatör izinlerini döndürür
            "id": "string",                 // Moderatör izinlerinin ID'si
            "community_id": "string",       // Topluluk ID'si
            "permission": ["string", ...]   // Güncellenmiş moderatör izinlerinin listesi
        }
        ```
      - Başarısız Yanıt:
        ```json
        {
            "error": "string",                  // Hata mesajı, örneğin: Topluluk bulunamayabilir veya kullanıcı yetkisi olmayabilir.
            "details": "string" || undefined    // Hata detayları, örneğin: Kullanıcı yetkisi yok veya topluluk bulunamadı.
        }
        ```
- `POST /kickMember` - Belirli bir topluluktan bir üyeyi atar
    - Gelebilecek Yanıtlar:
      - Başarılı Yanıt:
        ```json
        {
            "message": "string" // Başarılı bir şekilde üye atıldığını belirten mesaj
        }
        ```
      - Başarısız Yanıt:
        ```json
        {
            "error": "string",                  // Hata mesajı, örneğin: Üye bulunamayabilir veya kullanıcı yetkisi olmayabilir.
            "details": "string" || undefined    // Hata detayları, örneğin: Kullanıcı yetkisi yok veya üye bulunamadı.
        }
        ```
- `DELETE /leaveCommunity/:communityId` - Belirli bir topluluktan kullanıcıyı çıkarır
    - Gelebilecek Yanıtlar:
      - Başarılı Yanıt:
        ```json
        {
            "message": "string" // Başarılı bir şekilde topluluktan çıkıldığını belirten mesaj
        }
        ```
      - Başarısız Yanıt:
        ```json
        {
            "error": "string",                  // Hata mesajı, örneğin: Kullanıcı topluluk üyesi olmayabilir veya topluluk bulunamayabilir.
            "details": "string" || undefined    // Hata detayları, örneğin: Kullanıcı topluluk üyesi değil veya topluluk bulunamadı.
        }
        ```

### Kapalı Uç Noktalar (Servisler Arası İletişim için)

- `GET /internal/userRole/:userId/:communityId` - Check the role of a user in a specific community
- `GET /internal/userCommunities/:userId` - Get all communities a user is a member of
- `POST /internal/createCommunity` - Create a new community members
- `DELETE /internal/deleteCommunity/:communityId` - Delete a specific community by ID

## Moderator Yetkileri

- seeRequests - Topluluk üyelik isteklerini görme yetkisi
- resolveRequests - Topluluk üyelik isteklerini onaylama veya reddetme yetkisi
- kickMembers - Topluluktan üyeleri atma yetkisi
- setPermissions - Topluluk moderatörlerinin sahip olduğu izinleri ayarlama yetkisi
- setVisibility - Topluluk görünürlüğünü ayarlama yetkisi
- setAccessibility - Topluluk erişilebilirliğini ayarlama yetkisi
- setDescription - Topluluk açıklamasını ayarlama yetkisi
- setRules - Topluluk kurallarını ayarlama yetkisi
- setStatus - Topluluk durumunu ayarlama yetkisi (açık, kısıtlı, kapalı)
