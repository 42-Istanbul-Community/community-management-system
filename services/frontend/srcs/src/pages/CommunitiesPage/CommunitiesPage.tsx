import { useMemo, useState } from 'react'

import {
  Button,
  ClubCard,
  Container,
  EmptyState,
  SearchInput,
  Select,
  Tag,
} from '@/components/ui'
import { filterClubs } from '@/features/communities/lib'
import { clubTags, clubs } from '@/mocks'
import { SearchX } from 'lucide-react'

const accessOptions = [
  { value: 'all', label: 'Tüm katılım türleri' },
  { value: 'open', label: 'Açık' },
  { value: 'restricted', label: 'Kısıtlı' },
  { value: 'closed', label: 'Kapalı' },
]

const sortOptions = [
  { value: 'popular', label: 'En popüler' },
  { value: 'newest', label: 'En yeni' },
  { value: 'name', label: 'İsme göre' },
]

export default function CommunitiesPage() {
  const [query, setQuery] = useState('')
  const [access, setAccess] = useState('all')
  const [sort, setSort] = useState('popular')
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  const results = useMemo(
    () => filterClubs(clubs, { query, access, tags: selectedTags, sort }),
    [query, access, selectedTags, sort],
  )

  const hasFilters =
    query !== '' ||
    access !== 'all' ||
    sort !== 'popular' ||
    selectedTags.length > 0

  function toggleTag(tag: string) {
    setSelectedTags((current) =>
      current.includes(tag)
        ? current.filter((item) => item !== tag)
        : [...current, tag],
    )
  }

  function clearFilters() {
    setQuery('')
    setAccess('all')
    setSort('popular')
    setSelectedTags([])
  }

  return (
    <Container className="py-14">
      <div className="mx-auto max-w-150 text-center">
        <h1 className="font-display text-h2 font-semibold tracking-[-0.02em]">
          Kulüpler
        </h1>
        <p className="text-body-lg mt-3 text-neutral-700">
          İlgi alanınıza göre filtreleyin, size uygun topluluğu bulun.
        </p>
      </div>

      <div className="mt-10 flex flex-wrap items-center gap-3">
        <div className="min-w-70 flex-1">
          <SearchInput
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onClear={() => setQuery('')}
            placeholder="Kulüp ara..."
          />
        </div>

        <Select
          value={access}
          onValueChange={setAccess}
          options={accessOptions}
          ariaLabel="Katılım türü"
        />

        <Select
          value={sort}
          onValueChange={setSort}
          options={sortOptions}
          ariaLabel="Sıralama"
        />
      </div>

      <div className="mt-5 flex flex-wrap gap-1.5">
        {clubTags.map((tag) => (
          <Tag
            key={tag}
            isActive={selectedTags.includes(tag)}
            onClick={() => toggleTag(tag)}
          >
            {tag}
          </Tag>
        ))}
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
        <p aria-live="polite" className="text-caption text-neutral-500">
          {results.length} kulüp bulundu
        </p>

        {hasFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            Filtreleri temizle
          </Button>
        )}
      </div>

      {results.length > 0 ? (
        <div className="mt-5 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {results.map((club) => (
            <ClubCard key={club.slug} {...club} />
          ))}
        </div>
      ) : (
        <div className="mt-5">
          <EmptyState
            icon={<SearchX size={22} aria-hidden="true" />}
            title="Aradığınız kriterlere uygun kulüp bulunamadı"
            description="Farklı bir arama yapabilir veya seçtiğiniz filtreleri temizleyebilirsiniz."
            action={
              <Button variant="secondary" onClick={clearFilters}>
                Filtreleri temizle
              </Button>
            }
          />
        </div>
      )}
    </Container>
  )
}
