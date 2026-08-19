import { StepCard } from './StepCard'
import { Container } from '@/components/ui'
import { SectionHeading } from '@/components/ui/SectionHeading/SectionHeading'

const steps = [
  {
    number: '01',
    title: 'Kulübünüzü oluşturun',
    description:
      'Adını, açıklamasını ve katılım türünü belirleyip yayına alın.',
  },
  {
    number: '02',
    title: 'Üyeleri kabul edin',
    description: 'Başvuruları onaylayın, moderatör yetkilerini dağıtın.',
  },
  {
    number: '03',
    title: 'Etkinlik yayınlayın',
    description:
      'Kontenjan belirleyin, duyuruyu tüm üyelere tek seferde iletin.',
  },
  {
    number: '04',
    title: 'Katılımı izleyin',
    description: 'Kimin geldiğini görün, dönem sonunda raporu dışa aktarın.',
  },
]

export function HowItWorksSection() {
  return (
    <section className="border-y border-neutral-200 bg-white py-24">
      <Container>
        <SectionHeading
          eyebrow="Başlarken"
          title="Kulübünüz bugün yayında."
          className="mb-14"
        />

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step) => (
            <StepCard key={step.number} {...step} />
          ))}
        </div>
      </Container>
    </section>
  )
}
