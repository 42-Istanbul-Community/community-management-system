import { LegalPage, LegalSection } from '@/components/layout/LegalPage'
import { useDocumentTitle } from '@/hooks'

export function PrivacyPage() {
  useDocumentTitle('Gizlilik Politikası')

  return (
    <LegalPage title="Gizlilik Politikası" updatedAt="2026-08-22">
      <LegalSection title="Hangi verileri topluyoruz">
        <p>
          Hesap oluşturduğunuzda e-posta adresinizi ve şifrenizi alıyoruz.
          Şifreniz hiçbir zaman düz metin olarak saklanmaz; geri çevrilemez bir
          yöntemle şifrelenip öyle tutulur.
        </p>
        <p>
          Profilinizde bir görünen ad belirlersiniz. İsterseniz bir profil
          fotoğrafı yükleyebilirsiniz; bu isteğe bağlıdır ve dilediğiniz zaman
          kaldırabilirsiniz.
        </p>
        <p>
          Kulüplere katıldığınızda üyelik kaydınız, kulüp içindeki rolünüz ve
          etkinliklere katılım bilgileriniz saklanır.
        </p>
      </LegalSection>

      <LegalSection title="42 ile giriş yaptığınızda">
        <p>
          42 hesabınızla giriş yapmayı seçerseniz 42'den e-posta adresiniz,
          görünen adınız ve profil fotoğrafınızın adresi alınır. 42 şifreniz
          bize hiçbir zaman iletilmez.
        </p>
      </LegalSection>

      <LegalSection title="Verilerinizi kim görebilir">
        <p>
          Görünen adınız ve profil fotoğrafınız, üyesi olduğunuz kulüplerin
          diğer üyeleri tarafından görülebilir.
        </p>
        <p>
          E-posta adresiniz diğer kullanıcılara gösterilmez. Yalnızca sistem
          yöneticileri, hesap yönetimi gerektiren durumlarda erişebilir.
        </p>
        <p>
          Bir kulübe katılma başvurunuz, o kulübün moderatörleri ve yöneticileri
          tarafından görülür.
        </p>
      </LegalSection>

      <LegalSection title="Verilerinizi neden işliyoruz">
        <p>
          Toplanan verilerin tek amacı platformun işlemesidir: sizi tanımak,
          kulüp üyeliklerinizi yönetmek ve etkinlik katılımlarınızı takip etmek.
        </p>
        <p>
          Verileriniz reklam amacıyla kullanılmaz, üçüncü taraflara satılmaz
          veya devredilmez.
        </p>
      </LegalSection>

      <LegalSection title="Çerezler">
        <p>
          Oturumunuzu açık tutmak için tarayıcınızda bir kimlik doğrulama
          anahtarı saklanır. Bu anahtar yalnızca sizi tanımak için kullanılır;
          davranışlarınızı izlemez ve reklam amacı taşımaz.
        </p>
        <p>Platformda üçüncü taraf takip veya analiz çerezi bulunmaz.</p>
      </LegalSection>

      <LegalSection title="Verilerinizin saklanma süresi">
        <p>
          Hesabınız açık olduğu sürece verileriniz saklanır. Hesabınızı
          sildiğinizde profil bilgileriniz, üyelikleriniz ve katılım
          kayıtlarınız kaldırılır.
        </p>
        <p>
          Kulüp içinde paylaştığınız duyurular, kulübün geçmişini korumak için
          yazarı belirtilmeden kalabilir.
        </p>
      </LegalSection>

      <LegalSection title="Haklarınız">
        <p>
          Profil bilgilerinizi istediğiniz zaman değiştirebilir, profil
          fotoğrafınızı kaldırabilir ve hesabınızı silebilirsiniz.
        </p>
        <p>
          Hangi verilerinizin saklandığını öğrenmek isterseniz platform
          yöneticilerine başvurabilirsiniz.
        </p>
      </LegalSection>

      <LegalSection title="Bu politikadaki değişiklikler">
        <p>
          Bu metin değiştiğinde sayfanın üst kısmındaki güncelleme tarihi
          yenilenir. Önemli değişikliklerde kayıtlı kullanıcılar
          bilgilendirilir.
        </p>
      </LegalSection>
    </LegalPage>
  )
}
