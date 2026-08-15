import { FeaturedClubsSection } from './sections/FeaturedClubsSection/FeaturedClubsSection'
import { HeroSection } from './sections/Hero'
import { HowItWorksSection } from './sections/HowItWorksSection/HowItWorksSection'

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <HowItWorksSection />
      <FeaturedClubsSection />
    </>
  )
}
