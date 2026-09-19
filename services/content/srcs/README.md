# Community Management System - Content Servisi

Content servisi, Community Management System içindeki toplulukların içeriğini yöneten bir mikroservistir. Duyuruları, etkinlikleri ve etkinlik katılımını; dosya eklerini, görünürlük kurallarını ve kapasite kontrolünü de içerecek şekilde yönetir.

## Kimlik Doğrulama

Kimlik bilgisi, gateway tarafından `X-User-ID` ve `X-User-Role` başlıkları aracılığıyla iletilir (JWT doğrulaması bu serviste değil, gateway'de yapılır).

- Yazma işlemleri (POST, PUT, DELETE, join, leave) `X-User-ID` gerektirir. Eksikse `401 Unauthorized` döner.
- Okuma işlemleri (list, get, list participants) herkese açıktır. Anonim ziyaretçiler yalnızca `all` görünürlüğüne sahip içerikleri görebilir.

## Endpoint'ler

### Announcements - Duyurular
- `POST /announcements` — Yeni bir duyuru oluşturur (yazar `X-User-ID`'den alınır). `application/json` veya `multipart/form-data` kabul eder; isteğe bağlı `file` alanı bir dosya ekler.
- `GET /announcements?communityId={id}` — Bir topluluğun duyurularını listeler (ziyaretçinin görünürlük hakkına göre filtrelenir). `page` ve `limit` sorgu parametrelerini destekler.
- `GET /announcements/{id}` — ID'ye göre tek bir duyuruyu getirir.
- `PUT /announcements/{id}` — Bir duyuruyu günceller. `file` gönderilmesi eki değiştirir; `removeAttachment=true` gönderilmesi eki kaldırır; ikisi de gönderilmezse mevcut ek korunur.
- `DELETE /announcements/{id}` — Bir duyuruyu ve ekli dosyalarını siler.

### Events - Etkinlikler
- `POST /events` — Yeni bir etkinlik oluşturur (`endAt` zorunludur; `endAt`, `startAt`'tan önce olamaz). İsteğe bağlı `file` ekini kabul eder. `capacity` değeri 0 ise sınırsız anlamına gelir.
- `GET /events?communityId={id}` — Bir topluluğun etkinliklerini listeler (görünürlüğe göre filtrelenir). `page` ve `limit` desteklenir. Her etkinlik, onaylanmış katılımcı sayısını `participantCount` alanında ve mevcut kullanıcı için `isJoined` ile `myStatus` bilgilerini içerir. `isJoined` yalnızca durum `joined` ise `true` olur; onay bekleyen kullanıcı `false` görür ve durumunu `myStatus` alanından öğrenir.
- `GET /events/{id}` — ID'ye göre tek bir etkinliği getirir. Katılımcı sayısı `participantCount` alanında döner.
- `PUT /events/{id}` — Bir etkinliği günceller. Duyurularla aynı ek kuralları geçerlidir (`file` / `removeAttachment`).
- `DELETE /events/{id}` — Bir etkinliği ve ekli dosyalarını siler.

`participantCount`, kapasite kontrolüyle aynı tanımı kullanır: yalnızca `joined` durumundaki katılımcılar sayılır. Onay bekleyen ve reddedilen istekler bu sayıya dahil değildir.

### Events Participants - Etkinlik Katılımcıları
Etkinliğe katılım onaya tabidir. Kullanıcı istek gönderir, kaydı `requested`
durumunda oluşur; yetkili biri onaylayana kadar katılımcı sayılmaz.

- `POST /events/{id}/participants` — Mevcut kullanıcı için `requested` durumunda bir katılım isteği oluşturur. Kapasite bu aşamada kontrol edilmez; kontenjan dolu olsa bile istek kabul edilir. Yinelenen istekleri, etkinliği sona ermiş olanları ve daha önce reddedilmiş kullanıcıları geri çevirir.
- `PUT /events/{id}/participants/{userId}` — Bir katılımcının durumunu değiştirir (`requested`, `joined`, `rejected`, `no_show`). Yalnızca etkinliğin yazarı, `super_admin` veya topluluğun moderatör/admin'i çağırabilir. `joined`'a geçişte kapasite kontrol edilir; doluysa `409` döner.
- `DELETE /events/{id}/participants` — Mevcut kullanıcıyı bir etkinlikten çıkarır. Etkinlik sona ermişse veya kullanıcı reddedilmişse reddeder.
- `GET /events/{id}/participants` — Katılımcıları listeler. Yetkili biri (yazar, `super_admin`, moderatör/admin) tüm kayıtları görür; diğerleri yalnızca `joined` olanları görür.

Reddedilen kullanıcı o etkinliğe tekrar başvuramaz ve kendi kaydını silerek
bu kısıtı aşamaz. Kapasite yalnızca `joined` durumundakileri sayar.

## Internal endpoint'ler (servisler arası)

Bu endpoint'ler son kullanıcılar tarafından değil, diğer servisler tarafından çağrılır. `X-User-ID` auth kontrolü uygulanmaz ve yalnızca iç ağdan erişilebilir olmaları beklenir.

- `GET /internal/contents/{id}` — Tek bir duyuru veya etkinliğin görünürlüğünü ve topluluğunu döndürür; asset servisi dosya erişim yetkisini belirlemek için kullanır. Önce duyurularda, bulamazsa etkinliklerde arar. `{ "content": { "visibility", "community_id" } }` döner; eşleşen içerik yoksa `404` döner.
- `DELETE /internal/user/{userId}` — Belirtilen kullanıcının oluşturduğu tüm duyuru ve etkinlikleri, Rustfs'daki ekleriyle birlikte siler. Bir kullanıcı sistemden kaldırıldığında çağrılır. Kullanıcının hiç içeriği olmasa bile `200` döner.
- `DELETE /internal/community/{communityId}` — Belirtilen topluluğa ait tüm duyuru ve etkinlikleri, Rustfs'daki ekleriyle birlikte siler. Bir topluluk silindiğinde çağrılır. Topluluğun hiç içeriği olmasa bile `200` döner.

Her iki silme endpoint'inde de önce ekler Rustfs'dan silinir, ardından veritabanı kayıtları silinir. Etkinlik katılımcıları veritabanı cascade'i ile otomatik olarak silinir.

- `GET /internal/communities?cursor={n}&limit={n}&order={asc|desc}` — Son 30 gün içinde etkinlik oluşturmuş toplulukları aktifliklerine göre sıralayıp sayfalayarak döner. Aktiflik, topluluğun bu dönemde oluşturduğu etkinlik sayısıdır. `{ "communities": [ { "community_id" } ] }` döner. `cursor` atlanacak kayıt sayısı (varsayılan 0), `limit` dönülecek kayıt sayısı (varsayılan 20, en fazla 100), `order` sıralama yönü — `desc` en aktiften, `asc` en az aktiften başlar. `order` geçersizse `400` döner. Aralıkta etkinlik yoksa veya `cursor` toplam kayıt sayısını aşarsa boş liste döner.
- `GET /internal/health` — Veritabanı ve Rustfs bağlantılarını kontrol eder. İkisi de çalışıyorsa `200` ve `{ "status": "ok" }`, biri çalışmıyorsa `503` ile hangisinin düştüğü döner. Docker healthcheck tarafından kullanılmak üzere tasarlanmıştır.

### Topluluk aktiflik sıralaması

`GET /internal/communities`, gruplama, sayma, sıralama ve sayfalamanın tamamını tek bir veritabanı sorgusunda yapar; servis belleğine yalnızca istenen sayfa gelir.

Sıralama iki kademelidir: önce etkinlik sayısı, eşitlik durumunda `community_id`. İkinci kriter zorunludur — aynı sayıya sahip topluluklar arasında sabit bir sıra olmazsa, `cursor` ile sayfalandığında aynı kaydın iki kez dönmesi veya bir kaydın hiç dönmemesi mümkün olur.

Aktiflik, etkinliğin gerçekleşme tarihine değil oluşturulma tarihine (`created_at`) bakar; böylece ileri tarihli etkinlikler de sayılır. Yalnızca etkinlik sayısını dikkate alır, duyurular dahil değildir — ilgili dönemde hiç etkinlik oluşturmamış bir topluluk, duyurusu olsa bile listede yer almaz.

`cursor` durumu bu serviste tutulmaz. Çağıran servis, dönen kayıtları kendi tarafında filtreledikten sonra kaldığı konumu takip eder ve bir sonraki istekte `cursor` olarak gönderir.

## Dosya Ekleri

Ekler, `file` alanı altında `multipart/form-data` olarak kabul edilir. İkili veri **Rustfs**'ya (S3 uyumlu nesne depolama) yüklenir; veritabanında yalnızca dosya meta verileri (`key`, `name`, `type`, `size`) JSONB olarak saklanır.

- `key`, veritabanında saklanan erişim yoludur (ör. content/<uuid>.jpg). Rustfs'daki nesne adı önek olmadan tutulur (<uuid>.jpg); content/ öneki asset servisinin route'undan gelir.

- Oluşturma sırasında, önce kaydın ID'sinin var olması için kayıt eklenir, ardından bu ID nesne meta verisine gömülerek dosya yüklenir ve son olarak kayıt ekle güncellenir.
- Güncelleme sırasında, yeni bir `file` gönderilmesi yerine geçecek dosyayı yükler ve önceki nesneyi siler; `removeAttachment=true` mevcut nesneyi siler.
- Silme sırasında, kaydın ekli nesneleri Rustfs'dan kaldırılır.

Yüklenen her nesne aşağıdaki Rustfs meta verilerini taşır:

| Metadata | Value |
|----------|-------|
| `originalName` | istemcinin orijinal dosya adı |
| `Service` | `Content Service` |
| `ContentId` | sahip duyuru/etkinliğin ID'si |

### Depolama yapılandırması

Depolama için aşağıdaki ortam değişkenleri gereklidir:

- `RUSTFS_ENDPOINT` — Rustfs adresi (ör. `rustfs:9000`)
- `RUSTFS_BUCKET` — bucket adı (`content-data-bucket`)
- `RUSTFS_ACCESS_KEY` / `RUSTFS_SECRET_KEY` — entrypoint tarafından Docker secrets'tan enjekte edilir

## Ekleri okuma

Bu servis dosyaları saklar ancak sunmaz. İstemciler, saklanan `key` değerini kullanarak bir eki **asset servisinden** alır:

`GET /asset/{key}` — buradaki `{key}`, veritabanında saklanan değerdir.
(ör. `content/<uuid>.jpg`). Yani tam yol `/asset/content/<uuid>.jpg` olur.

Asset servisi, içeriğin kendisiyle aynı görünürlük kurallarını uygular: bir ek, yalnızca ait olduğu duyuru veya etkinliği görebilen ziyaretçiler tarafından erişilebilir.

## Yetkilendirme ve Görünürlük

- Güncelleme ve silme işlemlerine içeriğin **yazarı**, bir **super_admin** (global rol) veya **topluluğun moderatör/admin'i** izinlidir.
- Görünürlük seviyeleri (`all`, `member`, `moderator`), bir ziyaretçinin neyi görebileceğini filtreler; bir ziyaretçi, gerekli seviyesi kendi topluluk rolüne eşit veya altında olan içerikleri, artı kendi içeriğini görebilir.
- `visibility`, oluşturma ve güncelleme sırasında ayarlanabilir. Varsayılan değeri `member`'dır. Geçersiz bir değer gönderilirse `400` döner.
- Topluluk düzeyindeki üyelik ve roller, membership servisi çağrılarak çözümlenir.

## Topluluk Durumu Kontrolü

Yazma işlemlerinde yalnızca kullanıcının rolüne değil, topluluğun durumuna da bakılır. Kapalı (`inactive`) bir toplulukta hiçbir içerik oluşturulamaz, düzenlenemez, silinemez; etkinliklerine katılım da kabul edilmez.

Kontrol şu endpoint'lerde uygulanır: duyuru ve etkinlik oluşturma, güncelleme, silme ve etkinliğe katılma. Etkinlikten ayrılma bu kontrole tabi değildir — kapalı bir topluluğun etkinliğinden çıkmak engellenmez.

| Durum | Yanıt |
|---|---|
| Topluluk bulunamadı | `404` |
| Topluluk `active` değil | `403` |
| Community servisine ulaşılamadı | `503` |

Son satır bilinçli bir tercihtir: topluluğun durumu doğrulanamıyorsa yazma işlemine izin verilmez. Bu durumda `403` yerine `503` dönülür, çünkü istek reddedilmiş değil, doğrulanamamıştır.

`super_admin` bu kontrolden muaftır ve community servisine istek dahi atılmaz.

## Servisler Arası Bağımlılık

Content servisi iki servise bağımlıdır.

**Membership servisi** — bir kullanıcının topluluk içindeki rolünü belirler. `GET /userRole/{userId}/{communityId}` çağrılır ve `normal`, `member`, `moderator` veya `admin` döner; `normal`, kullanıcının üye olmadığı anlamına gelir. Bu rol hem görünürlük filtrelemesinde hem de değiştirme/silme yetkilendirmesinde kullanılır. Servise ulaşılamazsa rol `null` kabul edilir, yani ziyaretçi yetkisiz sayılır.

**Community servisi** — bir topluluğun `active` olup olmadığını belirler. `GET /internal/communities/{id}` çağrılır. Yazma işlemlerinden önce kontrol edilir; ayrıntısı yukarıdaki "Topluluk Durumu Kontrolü" bölümündedir.

Adresler `MEMBERSHIP_URL` ve `COMMUNITY_URL` ortam değişkenlerinden okunur.