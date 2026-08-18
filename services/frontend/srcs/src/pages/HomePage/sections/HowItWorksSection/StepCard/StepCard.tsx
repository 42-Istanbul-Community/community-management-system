import type { StepCardProps } from '../StepCard/StepCard.types'

export function StepCard({ number, title, description }: StepCardProps) {
  return (
    <div>
      <span className="bg-primary-100 font-display text-primary-700 mb-4.5 flex h-11 w-11 items-center justify-center rounded-[14px] text-[16px] font-bold">
        {number}
      </span>
      <h3 className="font-display text-h3 font-semibold">{title}</h3>
      <p className="text-body mt-2 text-neutral-700">{description}</p>
    </div>
  )
}
