# Membership Service

Membership servisi, kullanıcıların topluluklara katılma isteklerini yönetmelerini ve topluluk üyeliklerini kontrol etmelerini sağlar.

## Uç Noktalar

### Açık Uç Noktalar (Kullanıcılar için)
- `POST /communityRequests` - Yeni bir topluluk üyelik isteği oluşturur (Eğer topluluk açık ise direkt olarak üye olur, kısıtlı ise moderatör onayı bekler)
- `GET /members/:communityId` - Komünite üyelerini listeler, sayfalama ve filtreleme yapılabilir
- `GET /communityRequests/:communityId` - Belirli bir topluluk için üyelik isteklerini listeler
- `PUT /communityRequests/resolve` - Belirli bir üyelik isteğini kabul eder veya reddeder
- `GET /moderatorPermissions/:communityId` - Belirli bir topluluk için moderatör izinlerini getirir
- `PUT /moderatorPermissions/:communityId` - Belirli bir topluluk için moderatör izinlerini günceller
- `POST /kickMember` - Belirli bir topluluktan bir üyeyi atar
- `DELETE /leaveCommunity/:communityId` - Belirli bir topluluktan kullanıcıyı çıkarır

### Kapalı Uç Noktalar (Servisler Arası İletişim için)
- `GET /internal/userRole/:userId/:communityId` - Check the role of a user in a specific community
- `GET /internal/userCommunities/:userId` - Get all communities a user is a member of
- `POST /internal/createCommunity` - Create a new community members
- `DELETE /internal/deleteCommunity/:communityId` - Delete a specific community by ID


## Moderator Permissions 
seeRequests
resolveRequests
kickMembers
setPermissions
setVisibility
setAccessibility
setDescription
setRules
setStatus