import type { TabsProps } from './Tabs.types'
import { cn } from '@/lib'
import * as RadixTabs from '@radix-ui/react-tabs'

export function Tabs({ items, defaultValue, ariaLabel }: TabsProps) {
  return (
    <RadixTabs.Root defaultValue={defaultValue ?? items[0]?.value}>
      <RadixTabs.List
        aria-label={ariaLabel}
        className="flex gap-1 border-b border-neutral-200"
      >
        {items.map((item) => (
          <RadixTabs.Trigger
            key={item.value}
            value={item.value}
            className={cn(
              'text-body -mb-px cursor-pointer border-b-2 border-transparent px-4 py-3 font-medium',
              'text-neutral-600 transition-colors',
              'hover:text-neutral-900',
              'data-[state=active]:border-primary-600 data-[state=active]:text-primary-700',
            )}
          >
            {item.label}
          </RadixTabs.Trigger>
        ))}
      </RadixTabs.List>

      {items.map((item) => (
        <RadixTabs.Content key={item.value} value={item.value} className="pt-8">
          {item.content}
        </RadixTabs.Content>
      ))}
    </RadixTabs.Root>
  )
}
