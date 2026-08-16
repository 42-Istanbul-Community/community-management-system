import { useState } from 'react'

import { FaqItem } from './FaqItem'
import { Container } from '@/components/ui'
import { SectionHeading } from '@/components/ui/SectionHeading/SectionHeading'

const faqs = [
  {
    id: 'faq-create-club',
    question: 'Kulüp oluşturmak için ne yapmam gerekiyor?',
    answer:
      'Kulübünüzü tanıtan bir talep gönderiyorsunuz; adı, açıklaması ve varsa kulüp kuralları ile birlikte. Talebiniz platform yöneticileri tarafından incelenir, onaylandığında kulüp yayına alınır ve siz kulübün yöneticisi olursunuz.',
  },
  {
    id: 'faq-join-club',
    question: 'Bir kulübe nasıl katılırım?',
    answer:
      'Kulübün katılım türüne göre değişir. Açık kulüplere doğrudan katılırsınız. Kısıtlı kulüplerde bir form ile başvurursunuz ve moderatörler başvurunuzu değerlendirir. Kapalı kulüpler yeni üye almıyordur.',
  },
  {
    id: 'faq-roles',
    question: 'Kulüpte kimler hangi yetkiye sahip?',
    answer:
      'Üyeler duyuruları görür ve etkinliklere katılır. Moderatörler başvuruları onaylar, duyuru ve etkinlik yayınlar. Yöneticiler ise moderatör atar, yetkilerini düzenler ve kulüp ayarlarını yönetir.',
  },
  {
    id: 'faq-events',
    question: 'Etkinliklere katılım nasıl işliyor?',
    answer:
      'Etkinliğin kontenjanı varsa katılımınız o kontenjan dolana kadar geçerlidir. Bazı etkinlikler yalnızca üyelere veya moderatörlere açık olabilir; erişim kuralını etkinliği oluşturan kişi belirler.',
  },
  {
    id: 'faq-privacy',
    question: 'Verilerim nasıl korunuyor?',
    answer:
      'Adınız, e-postanız ve profil görseliniz dışında bir veri toplanmaz. Kulüp üyelikleriniz ve etkinlik katılımlarınız yalnızca ilgili kulübün yetkilileri tarafından görülebilir. Hesabınızı istediğiniz zaman silebilirsiniz.',
  },
]

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section
      id="faq"
      className="scroll-mt-4 border-y border-neutral-200 bg-white py-24"
    >
      <Container className="max-w-190">
        <SectionHeading
          eyebrow="Sorular"
          title="Sık sorulan sorular"
          className="mb-12"
        />

        <div>
          {faqs.map((faq, index) => (
            <FaqItem
              key={faq.id}
              id={faq.id}
              question={faq.question}
              answer={faq.answer}
              isOpen={openIndex === index}
              onToggle={() => setOpenIndex(openIndex === index ? null : index)}
            />
          ))}
        </div>
      </Container>
    </section>
  )
}
