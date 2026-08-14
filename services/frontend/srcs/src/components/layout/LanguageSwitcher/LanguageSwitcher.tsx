import { useState } from 'react'

import * as DropdownMenu from '@radix-ui/react-dropdown-menu'

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
        aria-label="Dil Seçimi"
        className="text-caption flex items-center gap-1.75 rounded-sm border border-neutral-200 bg-white px-3 py-2 font-sans font-medium text-neutral-700 transition-colors hover:border-neutral-300 hover:bg-neutral-100"
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="text-neutral-500"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="9" />
          <path d="M3 12h18M12 3a14 14 0 010 18a14 14 0 010-18z" />
        </svg>
        {current}
        <svg
          width="11"
          height="11"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
          className="text-neutral-500"
          aria-hidden="true"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          sideOffset={6}
          className="min-w-40 overflow-hidden rounded-md border border-neutral-200 bg-white shadow-md"
        >
          {languages.map((lang) => (
            <DropdownMenu.Item
              key={lang.code}
              onSelect={() => setCurrent(lang.code)}
              className="text-caption cursor-pointer px-3.5 py-2.5 text-neutral-900 outline-none data-highlighted:bg-neutral-100"
            >
              {lang.label}
            </DropdownMenu.Item>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  )
}
