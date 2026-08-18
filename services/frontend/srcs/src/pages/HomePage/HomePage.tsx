import { FaqSection } from './sections/FaqSection/FaqSection'
import { FeaturedClubsSection } from './sections/FeaturedClubsSection/FeaturedClubsSection'
import { HeroSection } from './sections/HeroSection'
import { HowItWorksSection } from './sections/HowItWorksSection/HowItWorksSection'
import { useDocumentTitle } from '@/hooks'

export default function HomePage() {
  useDocumentTitle('Community Management System')
  return (
    <>
      <HeroSection />
      <HowItWorksSection />
      <FeaturedClubsSection />
      <FaqSection />
    </>
  )
}
