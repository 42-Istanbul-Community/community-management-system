# Orchestration service of the Community Management System

Bu servis, kullanıcıların ve toplulukların yönetimi için gerekli olan tüm işlemleri koordine eden bir orkestrasyon hizmetidir. Bu hizmet, kullanıcı kayıtları, topluluk oluşturma ve silme gibi işlemleri yönetir ve diğer mikro hizmetlerle iletişim kurar.

## Endpoints

- `GET /`: Servisin durumunu kontrol etmek için bir sağlık kontrolü sağlar. Bu uç nokta, servisin çalışır durumda olduğunu doğrulamak için kullanılabilir.
  - Gelebilecek Yanıtlar:
    - Başarılı Yanıt:
      ```json
      {
        "service": "orchestration",
        "status": "ok"
      }
      ```
    - Başarısız Yanıt:
      ```json
      {
        "error": "string" // Hata mesajı, örneğin: Servis çalışmıyor olabilir.
      }
      ```
- `POST /register`: Yeni bir kullanıcı kaydı oluşturur. Bu uç nokta, kullanıcıların sisteme kaydolmasını sağlar ve gerekli bilgileri alır.
  - Gelebilecek Yanıtlar:
    - Başarılı Yanıt:

    ```json
    {
      "status": "success",
      "message": "User registered successfully"
    }
    ```

    - Başarısız Yanıt:

    ```json
    {
        "error": "string"                   // Hata mesajı, örneğin: E-posta zaten kayıtlı olabilir veya geçersiz bilgiler sağlanmış olabilir.
        "details": "string" || undefined    // Hata detayları, örneğin: E-posta formatı geçersiz olabilir.
    }
    ```

- `GET /42/callback`: Kullanıcının 42 OAuth ile kimlik doğrulamasını tamamladıktan sonra yönlendirileceği geri çağırma uç noktasıdır. Bu uç nokta, kimlik doğrulama yanıtını işler ve kullanıcı bilgilerini alır.
  - Gelebilecek Yanıtlar:
    - Başarılı Yanıt: Redirects the user to the frontend with a success message or token. etc: `example.com/exchange?token=AUTH_CODE`
    - Başarısız Yanıt:
    ```json
    {
      "status": "error",
      "message": "string", // Hata mesajı, örneğin: OAuth işlemi başarısız olabilir veya kullanıcı bilgileri alınamayabilir.
      "error": "string" // Hata mesajı, örneğin: OAuth işlemi başarısız olabilir veya kullanıcı bilgileri alınamayabilir.
    }
    ```

- `GET /google/callback`: Google OAuth'dan sonra kullanıcı kimlik doğrulamasının ardından çağrılacak olan uç noktadır. Bu uç nokta, kimlik doğrulama yanıtını işler ve kullanıcı bilgilerini alır.
  - Gelebilecek Yanıtlar:
    - Başarılı Yanıt: Redirects the user to the frontend with a success message or token. etc: `example.com/exchange?token=AUTH_CODE`
    - Başarısız Yanıt:
    ```json
    {
      "status": "error",
      "message": "string", // Hata mesajı, örneğin: OAuth işlemi başarısız olabilir veya kullanıcı bilgileri alınamayabilir.
      "error": "string" // Hata mesajı, örneğin: OAuth işlemi başarısız olabilir veya kullanıcı bilgileri alınamayabilir.
    }
    ```

- `POST /communities`: Yeni bir topluluk oluşturur. Bu uç nokta, topluluk adını, açıklamasını ve diğer gerekli bilgileri alır ve yeni bir topluluk kaydı oluşturur.
  - Gelebilecek Yanıtlar:
    - Başarılı Yanıt:

    ```json
    {
        "status": "string",
        "message": "string",
        "success": [
            "communityId": "string" // Oluşturulan topluluğun ID'si
            "adminId": "string"     // Oluşturulan topluluğun yöneticisinin ID'si
        ],
        "errors": undefined || [
            {
                "id": "string",     // Hata oluşan topluluk isteğinin ID'si
                "error": {...}      // Hata objesi
            }
            ...
        ]
    }
    ```

    - Başarısız Yanıt:

    ```json
    {
        "status": "error",
        "message": "string",    // Hata mesajı, örneğin: Topluluk adı zaten mevcut olabilir veya geçersiz bilgiler sağlanmış olabilir.
        "errors": undefined || [
            {
                "id": "string", // Hata oluşan topluluk isteğinin ID'si
                "error": {...}  // Hata objesi
            }
            ...
        ]
    }
    ```

- `DELETE /communities/{slug}`: Belirli bir topluluğu siler. Bu uç nokta, topluluk slug'ını alır ve ilgili topluluk kaydını siler.
  - Gelebilecek Yanıtlar:
    - Başarılı Yanıt:

    ```json
    {
      "status": "success",
      "message": "Community deleted successfully"
    }
    ```

    - Başarısız Yanıt:

    ```json
    {
      "status": "error",
      "message": "string", // Hata mesajı, örneğin: Topluluk bulunamayabilir veya kullanıcı yetkisi olmayabilir.
      "error": "string" // Hata mesajı, örneğin: Topluluk bulunamayabilir veya kullanıcı yetkisi olmayabilir.
    }
    ```

- `DELETE /user/{user_id}`: Belirli bir kullanıcıyı siler. Bu uç nokta, kullanıcı kimliğini alır ve ilgili kullanıcı kaydını siler.
  - Gelebilecek Yanıtlar:
    - Başarılı Yanıt:

    ```json
    {
      "status": "success",
      "message": "User deleted successfully"
    }
    ```

    - Başarısız Yanıt:

    ```json
    {
      "status": "error",
      "message": "string", // Hata mesajı, örneğin: Kullanıcı bulunamayabilir veya yetkisiz erişim olabilir.
      "error": "string" // Hata mesajı, örneğin: Kullanıcı bulunamayabilir veya yetkisiz erişim olabilir.
    }
    ```

- `POST /exchange`: Kullanıcının Oauth uygulamalarından aldığı geçici kodu kullanarak gerçek token almasını sağlar
  - Gelebilecek Yanıtlar:
    - Başarılı Yanıt:

    ```json
    {
      "status": "ok",
      "token": "string" // Kullanıcının alacağı gerçek token
    }
    ```

    - Başarısız Yanıt:

    ```json
    {
      "status": "error",
      "message": "string", // Hata mesajı, örneğin: Geçersiz kod veya yetkisiz erişim olabilir.
      "error": "string" // Hata mesajı, örneğin: Geçersiz kod veya yetkisiz erişim olabilir.
    }
    ```

- `GET /communities`: Toplulukları listeler. Bu uç nokta, toplulukları filtreleme ve sıralama seçenekleri ile birlikte döndürür.
  - Oluşturabileceğin istek şeması: /communities?cursor= kaldığın yer & limit=10 & sort_by= {created_at | member_count | activity} & order= {asc | desc} & status= {active | inactive} & tags= {tag1,tag2,...} & access= {open | restricted | closed}
  - Gelebilecek Yanıtlar:
    - Başarılı Yanıt:
    ```json
    {
      "status": "ok",
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
        }
        ...
      ],
      "nextCursor": "string" || null              // Sonraki sayfa için kullanılacak cursor değeri, eğer daha fazla topluluk varsa.
    ```
    - Başarısız Yanıt:
    ```json
    {
      "status": "error",
      "message": "string", // Hata mesajı, örneğin: Geçersiz filtreleme veya sıralama parametreleri olabilir.
      "service": "string" // Hata oluşan servis adı, örneğin: "community" veya "orchestration".
    }
    ```

## İhtiyaç Duyulan Uç Noktalar

### Kayıt işlemi için gereken uç noktalar

- `POST auth/internal/register`
- `POST auth/internal/loginWithMail`
- `POST id/internal/createUser`
- `DELETE auth/internal/user/{user_id}`
- `POST orchestration/register` Evet kendine istek atması gerekiyor

### Topluluk işlemleri için gereken uç noktalar

- `POST community/internal/communities`
- `POST membership/internal/createCommunities`

### Kullanıcı silme işlemleri için gereken uç noktalar

- `DELETE content/internal/user/{user_id}`
- `DELETE membership/internal/user/{user_id}`
- `DELETE community/internal/user/{user_id}`

### Topluluk silme işlemleri için gereken uç noktalar

- `DELETE membership/internal/community/{community_id}`
- `DELETE community/internal/communities/{slug}`
- `DELETE content/internal/community/{community_id}`
