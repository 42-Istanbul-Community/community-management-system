import { useState } from 'react'

import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { Check, Languages } from 'lucide-react'

const languages = [
  { code: 'TR', label: 'TR — Türkçe' },
  { code: 'EN', label: 'EN — English' },
  { code: 'AR', label: 'AR — العربية' },
]

export function LanguageSwitcher() {
  const [current, setCurrent] = useState('TR')

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger
        aria-label="Dil seçimi"
        className="text-caption flex cursor-pointer items-center gap-1.5 rounded-sm px-2 py-2 font-medium text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-neutral-900"
      >
        <Languages size={16} aria-hidden="true" />
        {current}
      </DropdownMenu.Trigger>

      <DropdownMenu.Content
        align="end"
        sideOffset={6}
        className="z-50 min-w-40 overflow-hidden rounded-md border border-neutral-200 bg-white shadow-md"
      >
        {languages.map((lang) => (
          <DropdownMenu.Item
            key={lang.code}
            onSelect={() => setCurrent(lang.code)}
            className="text-caption flex cursor-pointer items-center justify-between gap-3 px-3.5 py-2.5 text-neutral-900 outline-none data-highlighted:bg-neutral-100"
          >
            {lang.label}
            {current === lang.code && (
              <Check
                size={14}
                className="text-primary-600"
                aria-hidden="true"
              />
            )}
          </DropdownMenu.Item>
        ))}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  )
}
