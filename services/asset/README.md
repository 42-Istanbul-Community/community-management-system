# Community Management System - Asset Service

Asset servisi, kullanıcıların varlıklarını yönetmelerine ve varlıklarla ilgili bilgileri görüntülemelerine olanak tanır. Bu servis, varlıkların detaylarını almak, topluluk bilgilerini ve içerik bilgilerini almak için çeşitli uç noktalar sağlar.

## Uç Noktalar

- `GET users/:assetID`: Kullanıcıya ait varlık bilgilerini getirir.
  - Gelebilecek Yanıtlar:
    - Başarılı Yanıt:
      - Asset veri tipine göre değişiklik gösterebilir. Raw dosya göndermeye çalışır.
    - Başarısız Yanıt:
      ```json
      {
        "error": "string" // Hata mesajı, Gelen ID hatalı olabilir, ID bulunamayabilir ya da MINIO iletişimi sırasında bir hata oluşmuş olabilir.
      }
      ```
- `GET community/:assetID`: Toplulukla ilgili varlık bilgilerini getirir.
  - Gelebilecek Yanıtlar:
    - Başarılı Yanıt:
      - Asset veri tipine göre değişiklik gösterebilir. Raw dosya göndermeye çalışır.
    - Başarısız Yanıt:
      ```json
      {
        "error": "string" // Hata mesajı, Gelen ID hatalı olabilir, ID bulunamayabilir ya da MINIO iletişimi sırasında bir hata oluşmuş olabilir.
      }
      ```
- `GET content/:assetID`: İçerikle ilgili varlık bilgilerini getirir.
  - Gelebilecek Yanıtlar:
    - Başarılı Yanıt:
      - Asset veri tipine göre değişiklik gösterebilir. Raw dosya göndermeye çalışır.
    - Başarısız Yanıt:
      ```json
      {
        "error": "string" // Hata mesajı, Gelen ID hatalı olabilir, ID bulunamayabilir ya da MINIO iletişimi sırasında bir hata oluşmuş olabilir.
      }
      ```

## Gerekli Uç Noktalar

- `GET community/internal/communities/:slug` - komunitiyi slug ile getirir
- `GET membership/internal/userRole/:userid/:communityid` - Kullanıcının topluluk içindeki rolünü getirir
- `GET content/internal/:contentID` - İçerik ID'sine göre içerik bilgilerini getirir

## Kaynaklar

- https://www.npmjs.com/package/@aws-sdk/client-s3
