import type { SelectProps } from './Select.types'
import * as RadixSelect from '@radix-ui/react-select'
import { Check, ChevronDown } from 'lucide-react'

export function Select({
  value,
  onValueChange,
  options,
  ariaLabel,
  placeholder,
}: SelectProps) {
  return (
    <RadixSelect.Root value={value} onValueChange={onValueChange}>
      <RadixSelect.Trigger
        aria-label={ariaLabel}
        className="text-body flex cursor-pointer items-center justify-between gap-2 rounded-md border border-neutral-300 bg-white px-3.5 py-2.5 text-neutral-900 transition-colors hover:border-neutral-400"
      >
        <RadixSelect.Value placeholder={placeholder} />
        <RadixSelect.Icon>
          <ChevronDown
            size={15}
            className="text-neutral-500"
            aria-hidden="true"
          />
        </RadixSelect.Icon>
      </RadixSelect.Trigger>

      <RadixSelect.Content
        position="popper"
        sideOffset={6}
        className="z-50 min-w-(--radix-select-trigger-width) overflow-hidden rounded-md border border-neutral-200 bg-white shadow-md"
      >
        <RadixSelect.Viewport>
          {options.map((option) => (
            <RadixSelect.Item
              key={option.value}
              value={option.value}
              className="text-body flex cursor-pointer items-center justify-between gap-3 px-3.5 py-2.5 text-neutral-900 outline-none data-highlighted:bg-neutral-100"
            >
              <RadixSelect.ItemText>{option.label}</RadixSelect.ItemText>
              <RadixSelect.ItemIndicator>
                <Check
                  size={14}
                  className="text-primary-600"
                  aria-hidden="true"
                />
              </RadixSelect.ItemIndicator>
            </RadixSelect.Item>
          ))}
        </RadixSelect.Viewport>
      </RadixSelect.Content>
    </RadixSelect.Root>
  )
}
