export type FaqItemProps = {
  id: string
  question: string
  answer: string
  isOpen: boolean
  onToggle: () => void
}
