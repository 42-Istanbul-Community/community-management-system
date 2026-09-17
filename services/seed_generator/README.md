## CMS - Seed Generator

Topluluk yönetim sistemi için oluşturulmuş seed oluşturma aracı.

## Kullanım

```bash
cd services/seed_generator
node index.js
```

Bu komut `../${serviceName}/seed` klasörüne seed dosyalarını oluşturur. bu dosya sizin için test amaçlı veri sağlayacaktır. özelleştirmek için şu değerleri değiştirmeniz yeterlidir:

```Javascript
const NUM_USERS = 50;
const NUM_COMMUNITIES = 20;
const NUM_ANNOUNCEMENTS_PER_COMMUNITY = 5;
const NUM_EVENTS_PER_COMMUNITY = 5;
```

