# Community Management System - Bootstrap Service

Bu servis, sistemin başlangıç yapılandırmalarını ve gerekli başlangıç kullanıcılarını ve rolleri oluşturmak için tasarlanmıştır. Bu servis, sistemin ilk kurulumunda gerekli olan temel yapılandırmaları sağlar.

## Uses Endpoints

- `POST /id/createUser`: Sistemde yeni bir kullanıcı oluşturur.
- `POST /auth/register`: Yeni bir kullanıcı kaydeder ve kimlik doğrulama bilgilerini oluşturur.