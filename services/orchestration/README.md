# Orchestration service of the Community Management System

Bu servis, kullanıcıların ve toplulukların yönetimi için gerekli olan tüm işlemleri koordine eden bir orkestrasyon hizmetidir. Bu hizmet, kullanıcı kayıtları, topluluk oluşturma ve silme gibi işlemleri yönetir ve diğer mikro hizmetlerle iletişim kurar.

## Endpoints

- `GET /`: Servisin durumunu kontrol etmek için bir sağlık kontrolü sağlar. Bu uç nokta, servisin çalışır durumda olduğunu doğrulamak için kullanılabilir.
- `POST /register`: Yeni bir kullanıcı kaydı oluşturur. Bu uç nokta, kullanıcıların sisteme kaydolmasını sağlar ve gerekli bilgileri alır.
- `GET /42/callback`: Kullanıcının 42 OAuth ile kimlik doğrulamasını tamamladıktan sonra yönlendirileceği geri çağırma uç noktasıdır. Bu uç nokta, kimlik doğrulama yanıtını işler ve kullanıcı bilgilerini alır.
- `GET /google/callback`: Google OAuth'dan sonra kullanıcı kimlik doğrulamasının ardından çağrılacak olan uç noktadır. Bu uç nokta, kimlik doğrulama yanıtını işler ve kullanıcı bilgilerini alır.
- `POST /communities`: Yeni bir topluluk oluşturur. Bu uç nokta, topluluk adını, açıklamasını ve diğer gerekli bilgileri alır ve yeni bir topluluk kaydı oluşturur.
- `DELETE /communities/{slug}`: Belirli bir topluluğu siler. Bu uç nokta, topluluk slug'ını alır ve ilgili topluluk kaydını siler.
- `DELETE /user/{user_id}`: Belirli bir kullanıcıyı siler. Bu uç nokta, kullanıcı kimliğini alır ve ilgili kullanıcı kaydını siler.
- `POST /exchange`: Kullanıcının Oauth uygulamalarından aldığı geçici kodu kullanarak gerçek token almasını sağlar

## Needed Endpoints

### Register
- `POST auth/internal/register`
- `POST auth/internal/loginWithMail`
- `POST id/internal/createUser`
- `DELETE auth/internal/user/{user_id}`
- `POST orchestration/register` yes its needs to post to itself to register a user

### Manage Communities (Create)
- `POST community/internal/communities`
- `POST membership/internal/createCommunities`

### Delete User
- `DELETE content/internal/user/{user_id}`
- `DELETE membership/internal/user/{user_id}`
- `DELETE community/internal/user/{user_id}`

### Delete Community
- `DELETE membership/internal/community/{community_id}`
- `DELETE community/internal/communities/{slug}`
- `DELETE content/internal/community/{community_id}`

