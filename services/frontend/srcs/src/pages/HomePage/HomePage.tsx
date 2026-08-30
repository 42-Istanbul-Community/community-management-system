import {
  FaqSection,
  FeaturedCommunitiesSection,
  HeroSection,
  HowItWorksSection,
} from './sections'
import { useDocumentTitle } from '@/hooks'

export default function HomePage() {
  useDocumentTitle('Community Management System')
  return (
    <>
      <HeroSection />
      <HowItWorksSection />
      <FeaturedCommunitiesSection />
      <FaqSection />
    </>
  )
}
