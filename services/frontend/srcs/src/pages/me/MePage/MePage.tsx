import { useMemo } from 'react'
import { Link } from 'react-router'

import { Avatar, Button, Container, EmptyState } from '@/components/ui'
import { CommunityCard } from '@/components/ui'
import { useMe } from '@/features/auth/hooks'
import { useCommunities, useMyCommunities } from '@/features/communities/hooks'
import { useDocumentTitle } from '@/hooks'
import { assetUrl, getInitials } from '@/lib'
import { paths } from '@/routes/paths'
import { CalendarDays, FilePlus2, Inbox, Pencil, Users } from 'lucide-react'

const dateFormatter = new Intl.DateTimeFormat('tr-TR', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
})

export function MePage() {
  useDocumentTitle('Profilim')

  const { data: me, isPending } = useMe()
  const { data: memberships } = useMyCommunities()
  const { data: allCommunities } = useCommunities()

  const myCommunities = useMemo(() => {
    if (!memberships || !allCommunities) return []

    const ids = new Set(memberships.map((item) => item.community_id))
    return allCommunities.filter((community) => ids.has(community.id))
  }, [memberships, allCommunities])

  if (isPending) {
    return (
      <Container className="py-14">
        <p className="text-body text-neutral-600">Yükleniyor...</p>
      </Container>
    )
  }

  if (!me) {
    return (
      <Container className="py-14">
        <h1 className="font-display text-h2 font-semibold tracking-tight">
          Profil yüklenemedi
        </h1>
        <p className="text-body-lg mt-3 text-neutral-700">
          Lütfen daha sonra tekrar deneyiniz.
        </p>
      </Container>
    )
  }

  return (
    <div className="pb-20">
      <div aria-hidden="true" className="bg-primary-200 h-32 w-full sm:h-40" />

      <Container>
        <div className="-mt-14 flex flex-col items-center text-center">
          <Avatar
            initials={getInitials(me.name)}
            src={assetUrl(me.picture)}
            name={me.name}
            size="lg"
            className="border-4 border-neutral-50 shadow-sm"
          />

          <h1 className="font-display mt-4 text-[26px] font-semibold tracking-tight">
            {me.name}
          </h1>

          <p className="text-caption mt-2 flex items-center gap-1.75 text-neutral-500">
            <CalendarDays size={14} aria-hidden="true" />
            {dateFormatter.format(new Date(me.createdAt))} tarihinde katıldı
          </p>

          <Link to={paths.me.edit} className="mt-5 inline-flex">
            <Button variant="secondary" size="sm">
              <Pencil size={15} aria-hidden="true" />
              Profili düzenle
            </Button>
          </Link>
        </div>

        <div className="mx-auto mt-14 grid max-w-160 gap-4 sm:grid-cols-2">
          <Link
            to={paths.me.requests}
            className="hover:border-primary-300 rounded-lg border border-neutral-200 bg-white p-5 transition-colors"
          >
            <Inbox size={20} className="text-primary-600" aria-hidden="true" />
            <p className="text-body mt-3 font-medium text-neutral-900">
              Başvurularım
            </p>
            <p className="text-caption mt-1 text-neutral-600">
              Katılım ve kulüp açma taleplerinin durumu
            </p>
          </Link>

          <Link
            to={paths.me.newCommunity}
            className="hover:border-primary-300 rounded-lg border border-neutral-200 bg-white p-5 transition-colors"
          >
            <FilePlus2
              size={20}
              className="text-primary-600"
              aria-hidden="true"
            />
            <p className="text-body mt-3 font-medium text-neutral-900">
              Kulüp aç
            </p>
            <p className="text-caption mt-1 text-neutral-600">
              Yeni bir kulüp için talep oluştur
            </p>
          </Link>
        </div>

        <section className="mx-auto mt-14 max-w-160">
          <h2 className="font-display text-h3 mb-5 text-center font-semibold">
            Kulüplerim
          </h2>

          {myCommunities.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2">
              {myCommunities.map((community) => (
                <CommunityCard key={community.slug} {...community} />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={<Users size={22} aria-hidden="true" />}
              title="Henüz bir kulübe katılmadın"
              description="Kulüpleri keşfet ve ilgini çeken topluluklara katıl."
              action={
                <Link to={paths.communities.root}>
                  <Button variant="secondary">Kulüpleri keşfet</Button>
                </Link>
              }
            />
          )}
        </section>
      </Container>
    </div>
  )
}
