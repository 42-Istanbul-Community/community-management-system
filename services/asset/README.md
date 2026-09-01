# Community Management System - Asset Service

Asset servisi, kullanıcıların varlıklarını yönetmelerine ve varlıklarla ilgili bilgileri görüntülemelerine olanak tanır. Bu servis, varlıkların detaylarını almak, topluluk bilgilerini ve içerik bilgilerini almak için çeşitli uç noktalar sağlar.

## Uç Noktalar

- `GET users/:assetID`: Kullanıcıya ait varlık bilgilerini getirir.
- `GET community/:assetID`: Toplulukla ilgili varlık bilgilerini getirir.
- `GET content/:assetID`: İçerikle ilgili varlık bilgilerini getirir.

## Gerekli Uç Noktalar

- `GET community/internal/communities/:slug` - komunitiyi slug ile getirir
- `GET membership/internal/userRole/:userid/:communityid` - Kullanıcının topluluk içindeki rolünü getirir
- `GET content/internal/:contentID` - İçerik ID'sine göre içerik bilgilerini getirir

## Resources

- https://www.npmjs.com/package/@aws-sdk/client-s3