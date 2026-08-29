# Community Management System - Content Servisi

Content servisi, Community Management System içindeki toplulukların içeriğini yöneten bir mikroservistir. Duyuruları, etkinlikleri ve etkinlik katılımını; dosya eklerini, görünürlük kurallarını ve kapasite kontrolünü de içerecek şekilde yönetir.

## Kimlik Doğrulama

Kimlik bilgisi, gateway tarafından `X-User-ID` ve `X-User-Role` başlıkları aracılığıyla iletilir (JWT doğrulaması bu serviste değil, gateway'de yapılır).

- Yazma işlemleri (POST, PUT, DELETE, join, leave) `X-User-ID` gerektirir. Eksikse `401 Unauthorized` döner.
- Okuma işlemleri (POST, PUT, DELETE, join, leave) herkese açıktır. Anonim ziyaretçiler yalnızca `all` görünürlüğüne sahip içerikleri görebilir.

## Endpoint'ler

### Announcements - Duyurular
- `POST /announcements` — Yeni bir duyuru oluşturur (yazar `X-User-ID`'den alınır). `application/json` veya `multipart/form-data` kabul eder; isteğe bağlı `file` alanı bir dosya ekler.
- `GET /announcements?communityId={id}` — Bir topluluğun duyurularını listeler (ziyaretçinin görünürlük hakkına göre filtrelenir). `page` ve `limit` sorgu parametrelerini destekler.
- `GET /announcements/{id}` — ID'ye göre tek bir duyuruyu getirir.
- `PUT /announcements/{id}` — Bir duyuruyu günceller. `file` gönderilmesi eki değiştirir; `removeAttachment=true` gönderilmesi eki kaldırır; ikisi de gönderilmezse mevcut ek korunur.
- `DELETE /announcements/{id}` — Bir duyuruyu ve ekli dosyalarını siler.

### Events - Etkinlikler
- `POST /events` — Yeni bir etkinlik oluşturur (`endAt` zorunludur; `endAt`, `startAt`'tan önce olamaz). İsteğe bağlı `file` ekini kabul eder. `capacity` değeri 0 ise sınırsız anlamına gelir.
- `GET /events?communityId={id}` — Bir topluluğun etkinliklerini listeler (görünürlüğe göre filtrelenir). `page` ve `limit` desteklenir. Her etkinlik, mevcut kullanıcı için `isJoined` ve `myStatus` bilgilerini içerir.
- `GET /events/{id}` — ID'ye göre tek bir etkinliği getirir.
- `PUT /events/{id}` — Bir etkinliği günceller. Duyurularla aynı ek kuralları geçerlidir (`file` / `removeAttachment`).
- `DELETE /events/{id}` — Bir etkinliği ve ekli dosyalarını siler.

### Events Participants - Etkinlik Katılımcıları
- `POST /events/{id}/participants` — Mevcut kullanıcıyı bir etkinliğe katılımcı olarak ekler. Yinelenen katılımları reddeder, kapasiteyi zorunlu kılar ve etkinlik zaten sona ermişse reddeder.
- `DELETE /events/{id}/participants` — Mevcut kullanıcıyı bir etkinlikten çıkarır. Etkinlik zaten sona ermişse reddeder.
- `GET /events/{id}/participants` — Bir etkinliğin katılımcılarını listeler.

## Internal endpoint'ler (servisler arası)

Bu endpoint'ler son kullanıcılar tarafından değil, diğer servisler tarafından çağrılır. `X-User-ID` auth kontrolü uygulanmaz ve yalnızca iç ağdan erişilebilir olmaları beklenir.

- `GET /internal/contents/{id}` — Tek bir duyuru veya etkinliğin görünürlüğünü ve topluluğunu döndürür; asset servisi dosya erişim yetkisini belirlemek için kullanır. Önce duyurularda, bulamazsa etkinliklerde arar. `{ "content": { "visibility", "community_id" } }` döner; eşleşen içerik yoksa `404` döner.
- `DELETE /internal/user/{userId}` — Belirtilen kullanıcının oluşturduğu tüm duyuru ve etkinlikleri, MinIO'daki ekleriyle birlikte siler. Bir kullanıcı sistemden kaldırıldığında çağrılır. Kullanıcının hiç içeriği olmasa bile `200` döner.
- `DELETE /internal/community/{communityId}` — Belirtilen topluluğa ait tüm duyuru ve etkinlikleri, MinIO'daki ekleriyle birlikte siler. Bir topluluk silindiğinde çağrılır. Topluluğun hiç içeriği olmasa bile `200` döner.

Her iki silme endpoint'inde de önce ekler MinIO'dan silinir, ardından veritabanı kayıtları silinir. Etkinlik katılımcıları veritabanı cascade'i ile otomatik olarak silinir.

## Dosya Ekleri

Ekler, `file` alanı altında `multipart/form-data` olarak kabul edilir. İkili veri **MinIO**'ya (S3 uyumlu nesne depolama) yüklenir; veritabanında yalnızca dosya meta verileri (`key`, `name`, `type`, `size`) JSONB olarak saklanır.

- `key`, nesnenin `content-data` bucket'ı içindeki yoludur (ör. `content/<uuid>.jpg`). Dosyalar istemcilere bu servis tarafından değil, **asset servisi** tarafından sunulur.
- Oluşturma sırasında, önce kaydın ID'sinin var olması için kayıt eklenir, ardından bu ID nesne meta verisine gömülerek dosya yüklenir ve son olarak kayıt ekle güncellenir.
- Güncelleme sırasında, yeni bir `file` gönderilmesi yerine geçecek dosyayı yükler ve önceki nesneyi siler; `removeAttachment=true` mevcut nesneyi siler.
- Silme sırasında, kaydın ekli nesneleri MinIO'dan kaldırılır.

Yüklenen her nesne aşağıdaki MinIO meta verilerini taşır:

| Metadata | Value |
|----------|-------|
| `originalName` | istemcinin orijinal dosya adı |
| `Service` | `Content Service` |
| `ContentId` | sahip duyuru/etkinliğin ID'si |

### Depolama yapılandırması

Depolama için aşağıdaki ortam değişkenleri gereklidir:

- `MINIO_ENDPOINT` — MinIO adresi (ör. `minio:9000`)
- `MINIO_BUCKET` — bucket adı (`content-data`)
- `MINIO_ACCESS_KEY` / `MINIO_SECRET_KEY` — entrypoint tarafından Docker secrets'tan enjekte edilir

## Ekleri okuma

Bu servis dosyaları saklar ancak sunmaz. İstemciler, saklanan `key` değerini kullanarak bir eki **asset servisinden** alır:

`GET /asset/content/{key}`

Asset servisi, içeriğin kendisiyle aynı görünürlük kurallarını uygular: bir ek, yalnızca ait olduğu duyuru veya etkinliği görebilen ziyaretçiler tarafından erişilebilir.

## Yetkilendirme ve Görünürlük

- Güncelleme ve silme işlemlerine içeriğin **yazarı**, bir **super_admin** (global rol) veya **topluluğun moderatör/admin'i** izinlidir.
- Görünürlük seviyeleri (`all`, `community_page`, `member`, `moderator`), bir ziyaretçinin neyi görebileceğini filtreler; bir ziyaretçi, gerekli seviyesi kendi topluluk rolüne eşit veya altında olan içerikleri, artı kendi içeriğini görebilir.
- `visibility`, oluşturma ve güncelleme sırasında ayarlanabilir. Varsayılan değeri `member`'dır.
- Topluluk düzeyindeki üyelik ve roller, membership servisi çağrılarak çözümlenir.

## Servisler Arası Bağımlılık

Content servisi, bir kullanıcının bir topluluk içindeki rolünü belirlemek için membership servisini sorgular. Membership servisinin dahili endpoint'ini (`GET /internal/userRole/{userId}/{communityId}`) çağırır; bu endpoint kullanıcının rolünü döner (`normal`, `member`, `moderator` veya `admin`) — `normal`, kullanıcının üye olmadığı anlamına gelir. Bu rol, hem görünürlük filtrelemesi hem de değiştirme/silme yetkilendirmesi için kullanılır.
