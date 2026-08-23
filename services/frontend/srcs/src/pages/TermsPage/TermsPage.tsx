import { LegalPage, LegalSection } from '@/components/layout/LegalPage'
import { useDocumentTitle } from '@/hooks'

export default function TermsPage() {
  useDocumentTitle('Kullanım Şartları')

  return (
    <LegalPage title="Kullanım Şartları" updatedAt="2026-08-22">
      <LegalSection title="Bu platform ne işe yarar">
        <p>
          Bu platform, öğrenci kulüplerinin duyurularını paylaşması,
          etkinliklerini duyurması ve üyeliklerini yönetmesi için kurulmuştur.
          Kullanımı ücretsizdir.
        </p>
        <p>Hesap oluşturarak bu şartları kabul etmiş sayılırsınız.</p>
      </LegalSection>

      <LegalSection title="Hesabınız">
        <p>
          Hesabınızın güvenliğinden siz sorumlusunuz. Şifrenizi başkalarıyla
          paylaşmayın ve hesabınıza yetkisiz erişim olduğunu düşünüyorsanız
          yöneticilere bildirin.
        </p>
        <p>
          Her kullanıcı yalnızca bir hesap açabilir. Başkasının adına hesap
          açmak veya kimliğinizi yanlış beyan etmek yasaktır.
        </p>
      </LegalSection>

      <LegalSection title="Kulüplere katılım">
        <p>
          Kulüpler üç türde olabilir: herkese açık kulüplere doğrudan
          katılırsınız, kısıtlı kulüplere başvurursunuz ve moderatörler
          değerlendirir, kapalı kulüpler yeni üye almaz.
        </p>
        <p>
          Kulüp moderatörleri ve yöneticileri, kendi kulüpleri içinde üyeleri
          çıkarma ve başvuruları reddetme yetkisine sahiptir.
        </p>
      </LegalSection>

      <LegalSection title="Kulüp kurma">
        <p>
          Kulüp kurmak için bir talep gönderirsiniz. Talepler platform
          yöneticileri tarafından değerlendirilir; onaylanma garantisi yoktur.
        </p>
        <p>
          Kulüp kurucusu, kulübün yöneticisi olur ve kulüp içeriğinden
          sorumludur.
        </p>
      </LegalSection>

      <LegalSection title="Paylaştığınız içerik">
        <p>
          Duyurular, etkinlikler ve yüklediğiniz dosyalar dahil olmak üzere
          paylaştığınız içerikten siz sorumlusunuz.
        </p>
        <p>Şunları paylaşmak yasaktır:</p>
        <ul className="ms-5 flex list-disc flex-col gap-1.5">
          <li>Nefret söylemi, hakaret veya taciz içeren içerikler</li>
          <li>
            Başkalarının kişisel bilgilerini rızası olmadan ifşa eden içerikler
          </li>
          <li>Telif hakkı ihlal eden materyaller</li>
          <li>
            Yasa dışı faaliyetleri teşvik eden veya kolaylaştıran içerikler
          </li>
          <li>Spam, reklam veya alakasız toplu paylaşımlar</li>
        </ul>
      </LegalSection>

      <LegalSection title="Moderasyon">
        <p>
          Kulüp moderatörleri kendi kulüplerindeki içerikleri düzenleyebilir
          veya kaldırabilir. Platform yöneticileri, bu şartları ihlal eden
          içerikleri kaldırma ve hesapları askıya alma hakkını saklı tutar.
        </p>
        <p>Ciddi ihlallerde hesabınız uyarı yapılmadan kapatılabilir.</p>
      </LegalSection>

      <LegalSection title="Hizmetin sürekliliği">
        <p>
          Platform öğrenci projesi olarak geliştirilmektedir. Kesintisiz
          çalışacağı veya verilerin her koşulda korunacağı garanti edilmez.
        </p>
        <p>Önemli verilerinizin ayrı bir kopyasını tutmanızı öneririz.</p>
      </LegalSection>

      <LegalSection title="Hesabınızı kapatma">
        <p>
          Hesabınızı istediğiniz zaman silebilirsiniz. Silme işlemi geri
          alınamaz; üyelikleriniz ve katılım kayıtlarınız kaldırılır.
        </p>
      </LegalSection>

      <LegalSection title="Şartlardaki değişiklikler">
        <p>
          Bu şartlar değiştiğinde sayfanın üst kısmındaki güncelleme tarihi
          yenilenir. Değişiklikten sonra platformu kullanmaya devam etmeniz,
          yeni şartları kabul ettiğiniz anlamına gelir.
        </p>
      </LegalSection>
    </LegalPage>
  )
}
