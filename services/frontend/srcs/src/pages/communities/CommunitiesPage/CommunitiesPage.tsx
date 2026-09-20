import { useEffect, useMemo, useRef, useState } from 'react'

import {
  Button,
  CommunityCard,
  Container,
  EmptyState,
  SearchInput,
  Select,
  Tag,
} from '@/components/ui'
import { getCommunities } from '@/features/communities/api'
import type {
  ApiCommunityAccess,
  ApiCommunityStatus,
  CommunitiesQuery,
} from '@/features/communities/api'
import { useCommunityMemberCounts, useTags } from '@/features/communities/hooks'
import { toCommunity } from '@/features/communities/lib'
import { useDocumentTitle } from '@/hooks'
import { useInfiniteQuery } from '@tanstack/react-query'
import { CloudOff, SearchX } from 'lucide-react'

const VISIBLE_TAG_COUNT = 8

const accessOptions = [
  { value: 'all', label: 'Tüm katılım türleri' },
  { value: 'open', label: 'Açık' },
  { value: 'restricted', label: 'Kısıtlı' },
  { value: 'closed', label: 'Kapalı' },
]

const statusOptions = [
  { value: 'all', label: 'Tüm durumlar' },
  { value: 'active', label: 'Aktif' },
  { value: 'inactive', label: 'Pasif' },
]

const sortOptions = [
  { value: 'popular', label: 'En popüler' },
  { value: 'members', label: 'En çok üye' },
  { value: 'newest', label: 'En yeni' },
]

const sortByQuery: Record<string, CommunitiesQuery['sortBy']> = {
  popular: 'activity',
  members: 'member_count',
  newest: 'created_at',
}

export function CommunitiesPage() {
  useDocumentTitle('Kulüpler')

  const [query, setQuery] = useState('')
  const [text, setText] = useState('')
  const [access, setAccess] = useState('all')
  const [status, setStatus] = useState('all')
  const [sort, setSort] = useState('members')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [showAllTags, setShowAllTags] = useState(false)

  useEffect(() => {
    const timeout = setTimeout(() => setText(query), 400)
    return () => clearTimeout(timeout)
  }, [query])

  const { data: tagNames } = useTags()

  const filters: CommunitiesQuery = {
    text: text || undefined,
    access: access === 'all' ? undefined : (access as ApiCommunityAccess),
    status: status === 'all' ? undefined : (status as ApiCommunityStatus),
    tags: selectedTags.length > 0 ? selectedTags : undefined,
    sortBy: sortByQuery[sort],
    order: 'desc',
  }

  const {
    data: rawCommunities,
    isPending,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['communities', filters],
    queryFn: ({ pageParam }) =>
      getCommunities({ ...filters, cursor: pageParam }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    select: (data) =>
      data.pages.flatMap((page) => page.communities.map(toCommunity)),
  })

  const communities = useCommunityMemberCounts(rawCommunities)

  const sentinelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const element = sentinelRef.current
    if (!element || !hasNextPage) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) fetchNextPage()
      },
      { rootMargin: '200px' },
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [hasNextPage, fetchNextPage])

  const results = communities ?? []

  const allTags = useMemo(
    () => [...(tagNames ?? [])].sort((a, b) => a.localeCompare(b, 'tr')),
    [tagNames],
  )

  const visibleTags = showAllTags
    ? allTags
    : [...new Set([...allTags.slice(0, VISIBLE_TAG_COUNT), ...selectedTags])]

  const hiddenTagCount = allTags.length - visibleTags.length

  const hasFilters =
    query !== '' ||
    access !== 'all' ||
    status !== 'all' ||
    sort !== 'members' ||
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
    setStatus('all')
    setSort('members')
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
          value={status}
          onValueChange={setStatus}
          options={statusOptions}
          ariaLabel="Durum"
        />

        <Select
          value={sort}
          onValueChange={setSort}
          options={sortOptions}
          ariaLabel="Sıralama"
        />
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-1.5">
        {visibleTags.map((tag) => (
          <Tag
            key={tag}
            isActive={selectedTags.includes(tag)}
            onClick={() => toggleTag(tag)}
          >
            {tag}
          </Tag>
        ))}

        {hiddenTagCount > 0 && (
          <button
            type="button"
            onClick={() => setShowAllTags(true)}
            className="text-tag hover:border-primary-600 hover:text-primary-700 cursor-pointer rounded-full border border-dashed border-neutral-300 px-2.5 py-1 font-medium text-neutral-600 transition-colors"
          >
            {hiddenTagCount} etiket daha
          </button>
        )}

        {showAllTags && (
          <button
            type="button"
            onClick={() => setShowAllTags(false)}
            className="text-tag hover:border-primary-600 hover:text-primary-700 cursor-pointer rounded-full border border-dashed border-neutral-300 px-2.5 py-1 font-medium text-neutral-600 transition-colors"
          >
            Daha az göster
          </button>
        )}
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
        {!isPending && !isError && (
          <p aria-live="polite" className="text-caption text-neutral-500">
            {results.length} kulüp görüntüleniyor
          </p>
        )}

        {hasFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            Filtreleri temizle
          </Button>
        )}
      </div>

      {isPending ? (
        <div className="mt-5 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="h-72 animate-pulse rounded-lg border border-neutral-200 bg-white"
            />
          ))}
        </div>
      ) : isError ? (
        <div className="mt-5">
          <EmptyState
            icon={<CloudOff size={22} aria-hidden="true" />}
            title="Kulüpler yüklenemedi"
            description="Sunucuya ulaşılamadı. Lütfen daha sonra tekrar deneyin."
          />
        </div>
      ) : results.length > 0 ? (
        <section aria-labelledby="community-list-heading" className="mt-5">
          <h2 id="community-list-heading" className="sr-only">
            Kulüp listesi
          </h2>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {results.map((community) => (
              <CommunityCard key={community.slug} {...community} />
            ))}
          </div>

          <div ref={sentinelRef} aria-hidden="true" className="h-px" />

          {isFetchingNextPage && (
            <p className="text-caption mt-4 text-center text-neutral-500">
              Yükleniyor…
            </p>
          )}
        </section>
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
