import { FaqSection } from './sections/FaqSection/FaqSection'
import { FeaturedClubsSection } from './sections/FeaturedClubsSection/FeaturedClubsSection'
import { HeroSection } from './sections/HeroSection'
import { HowItWorksSection } from './sections/HowItWorksSection/HowItWorksSection'

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <HowItWorksSection />
      <FeaturedClubsSection />
      <FaqSection />
    </>
  )
}
