import type { SearchInputProps } from './SearchInput.types'
import { cn } from '@/lib'
import { Search, X } from 'lucide-react'

export function SearchInput({
  className,
  onClear,
  value,
  ...props
}: SearchInputProps) {
  const hasValue = Boolean(value)

  return (
    <div className="relative">
      <Search
        size={17}
        aria-hidden="true"
        className="pointer-events-none absolute inset-s-3.5 top-1/2 -translate-y-1/2 text-neutral-400"
      />

      <input
        type="search"
        value={value}
        className={cn(
          'text-body w-full rounded-md border border-neutral-300 bg-white py-2.5 ps-11 pe-10 text-neutral-900 transition-colors duration-150 placeholder:text-neutral-400 hover:border-neutral-400 [&::-webkit-search-cancel-button]:hidden',
          className,
        )}
        {...props}
      />

      {hasValue && onClear && (
        <button
          type="button"
          onClick={onClear}
          aria-label="Aramayı temizle"
          className="absolute inset-e-2.5 top-1/2 flex h-6 w-6 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-800"
        >
          <X size={14} aria-hidden="true" />
        </button>
      )}
    </div>
  )
}
