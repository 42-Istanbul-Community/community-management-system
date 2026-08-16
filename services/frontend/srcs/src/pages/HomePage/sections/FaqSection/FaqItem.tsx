import type { FaqItemProps } from './FaqItem.types'
import { cn } from '@/lib/cn'
import { ChevronDown } from 'lucide-react'

export function FaqItem({
  id,
  question,
  answer,
  isOpen,
  onToggle,
}: FaqItemProps) {
  const buttonId = `${id}-button`
  const panelId = `${id}-panel`

  return (
    <div className="border-b border-neutral-200">
      <h3>
        <button
          id={buttonId}
          type="button"
          onClick={onToggle}
          aria-expanded={isOpen}
          aria-controls={panelId}
          className="flex w-full cursor-pointer items-center justify-between gap-5 py-5.5 text-start"
        >
          <span className="font-display text-[18px] font-semibold">
            {question}
          </span>
          <span
            className={cn(
              'bg-primary-100 flex h-8 w-8 shrink-0 items-center justify-center rounded-full',
              'transition-transform duration-150',
              isOpen && 'rotate-180',
            )}
          >
            <ChevronDown
              size={16}
              className="text-primary-700"
              aria-hidden="true"
            />
          </span>
        </button>
      </h3>

      <div
        id={panelId}
        role="region"
        aria-labelledby={buttonId}
        className={cn(
          'grid transition-[grid-template-rows] duration-300 ease-out',
          isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
        )}
      >
        <div className="overflow-hidden">
          <p className="max-w-160 pb-5.5 text-[16px] leading-[1.7] text-neutral-700">
            {answer}
          </p>
        </div>
      </div>
    </div>
  )
}
