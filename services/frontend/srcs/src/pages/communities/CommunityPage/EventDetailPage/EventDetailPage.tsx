import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router'

import type { BadgeTone } from '@/components/ui'
import {
  Alert,
  AttachmentList,
  Avatar,
  Badge,
  Breadcrumb,
  Button,
  Container,
  ProgressBar,
  buttonStyles,
} from '@/components/ui'
import { useUsers } from '@/features/auth/hooks'
import { useCommunity } from '@/features/communities/hooks'
import type { EventParticipantStatus } from '@/features/content/api'
import {
  useAttachmentUrls,
  useDeleteEvent,
  useEvent,
  useEventParticipants,
  useEventParticipation,
  useUpdateParticipantStatus,
} from '@/features/content/hooks'
import { useCommunityPermissions } from '@/features/membership/hooks'
import { useDocumentTitle } from '@/hooks'
import { assetUrl, getInitials } from '@/lib'
import { paths } from '@/routes/paths'
import { useAuthStore } from '@/stores'
import { CalendarDays, Check, Clock, Users, X } from 'lucide-react'

const participantStatusLabels: Record<EventParticipantStatus, string> = {
  requested: 'İstek gönderdi',
  joined: 'Katıldı',
  rejected: 'Reddedildi',
  no_show: 'Gelmedi',
}

const participantStatusTones: Record<EventParticipantStatus, BadgeTone> = {
  requested: 'warning',
  joined: 'success',
  rejected: 'danger',
  no_show: 'neutral',
}

const dateFormatter = new Intl.DateTimeFormat('tr-TR', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
})

const timeFormatter = new Intl.DateTimeFormat('tr-TR', {
  hour: '2-digit',
  minute: '2-digit',
})

export function EventDetailPage() {
  const { slug, id } = useParams<{ slug: string; id: string }>()
  const navigate = useNavigate()
  const [now] = useState(() => Date.now())

  const { data: community } = useCommunity(slug)
  const {
    data: event,
    isPending,
    isStatusLoading,
  } = useEvent(id, slug, community?.id)
  const { join, leave } = useEventParticipation(community?.id)
  const token = useAuthStore((state) => state.token)
  const currentUserId = useAuthStore((state) => state.user?.id)
  const isSuperAdmin = useAuthStore(
    (state) => state.user?.role === 'super_admin',
  )
  const { isMember, canModerate } = useCommunityPermissions(community?.id)
  const attachments = useAttachmentUrls(event?.attachments ?? [])
  const { data: participants } = useEventParticipants(event?.id)
  const updateParticipant = useUpdateParticipantStatus(community?.id)
  const remove = useDeleteEvent(community?.id)
  const [confirmingDelete, setConfirmingDelete] = useState(false)

  const participantIds = participants?.map((item) => item.userId) ?? []
  const { data: participantUsers } = useUsers(participantIds)

  useDocumentTitle(event?.title ?? 'Etkinlik')

  if (isPending) {
    return (
      <Container className="py-14">
        <p className="text-body text-neutral-600">Yükleniyor...</p>
      </Container>
    )
  }

  if (!event) {
    return (
      <Container className="py-14">
        <h1 className="font-display text-h2 font-semibold tracking-tight">
          Etkinlik bulunamadı
        </h1>
        <p className="text-body-lg mt-3 text-neutral-700">
          Aradığınız etkinlik kaldırılmış olabilir.
        </p>
      </Container>
    )
  }

  const startDate = new Date(event.startAt)
  const endDate = event.endAt ? new Date(event.endAt) : null
  const isFull =
    event.capacity !== null && event.participantCount >= event.capacity
  const isEnded = (endDate ?? startDate).getTime() < now
  const isCommunityInactive = community?.status === 'inactive' && !isSuperAdmin
  const isBusy = join.isPending || leave.isPending

  const timeRange = endDate
    ? `${timeFormatter.format(startDate)} - ${timeFormatter.format(endDate)}`
    : timeFormatter.format(startDate)

  const canEdit = canModerate || event.authorId === currentUserId

  return (
    <Container className="py-10">
      <div className="mx-auto max-w-180">
        <Breadcrumb
          items={[
            { label: 'Kulüpler', to: paths.communities.root },
            ...(community
              ? [
                  {
                    label: community.name,
                    to: paths.communities.detail(community.slug),
                  },
                ]
              : []),
            { label: event.title },
          ]}
        />

        <article className="mt-8">
          {remove.error && (
            <Alert tone="danger" className="mb-5">
              {remove.error.message}
            </Alert>
          )}
          {join.error && (
            <Alert tone="danger" className="mb-5">
              {join.error.message}
            </Alert>
          )}
          {leave.error && (
            <Alert tone="danger" className="mb-5">
              {leave.error.message}
            </Alert>
          )}
          {updateParticipant.error && (
            <Alert tone="danger" className="mb-5">
              {updateParticipant.error.message}
            </Alert>
          )}

          <h1 className="font-display text-h2 font-semibold tracking-[-0.02em]">
            {event.title}
          </h1>

          <div className="mt-6 rounded-lg border border-neutral-200 bg-white p-5">
            <dl className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <dt className="shrink-0">
                  <CalendarDays
                    size={17}
                    className="text-neutral-500"
                    aria-hidden="true"
                  />
                  <span className="sr-only">Tarih</span>
                </dt>
                <dd className="text-body text-neutral-800">
                  {dateFormatter.format(startDate)}
                </dd>
              </div>

              <div className="flex items-center gap-3">
                <dt className="shrink-0">
                  <Clock
                    size={17}
                    className="text-neutral-500"
                    aria-hidden="true"
                  />
                  <span className="sr-only">Saat</span>
                </dt>
                <dd className="text-body text-neutral-800">{timeRange}</dd>
              </div>

              <div className="flex items-center gap-3">
                <dt className="shrink-0">
                  <Users
                    size={17}
                    className="text-neutral-500"
                    aria-hidden="true"
                  />
                  <span className="sr-only">Katılım</span>
                </dt>
                <dd className="min-w-0 flex-1">
                  {event.capacity !== null ? (
                    <ProgressBar
                      value={event.participantCount}
                      max={event.capacity}
                      label={`${event.capacity} kişilik kontenjanın ${event.participantCount} tanesi doldu`}
                      className="max-w-80"
                    />
                  ) : (
                    <span className="text-body text-neutral-800">
                      {event.participantCount} kişi katılıyor
                    </span>
                  )}
                </dd>
              </div>
            </dl>

            <div className="mt-5 border-t border-neutral-100 pt-5">
              {isEnded ? (
                <Button disabled size="lg" className="w-full sm:w-auto">
                  Etkinlik sona erdi
                </Button>
              ) : !token ? (
                <Link
                  to={paths.login}
                  className={buttonStyles({
                    size: 'lg',
                    className: 'w-full sm:w-auto',
                  })}
                >
                  Katılmak için giriş yapın
                </Link>
              ) : isStatusLoading ? (
                <Button
                  key="loading"
                  disabled
                  size="lg"
                  className="w-full sm:w-auto"
                >
                  Yükleniyor…
                </Button>
              ) : event.myStatus === 'joined' ? (
                <Button
                  variant="secondary"
                  size="lg"
                  className="w-full"
                  disabled={isBusy}
                  onClick={() => leave.mutate(event.id)}
                >
                  {leave.isPending ? 'Ayrılıyor…' : 'Katılımı iptal et'}
                </Button>
              ) : event.myStatus === 'requested' ? (
                <Button
                  variant="secondary"
                  size="lg"
                  className="w-full"
                  disabled={isBusy}
                  onClick={() => leave.mutate(event.id)}
                >
                  {leave.isPending ? 'Geri çekiliyor…' : 'İsteği geri çek'}
                </Button>
              ) : event.myStatus === 'rejected' ? (
                <Button disabled size="lg" className="w-full sm:w-auto">
                  Katılım isteğiniz reddedildi
                </Button>
              ) : event.myStatus === 'no_show' ? (
                <Button disabled size="lg" className="w-full sm:w-auto">
                  Gelmedi olarak işaretlendiniz
                </Button>
              ) : !isMember ? (
                <Button disabled size="lg" className="w-full sm:w-auto">
                  Katılmak için kulübe üye olmalısınız
                </Button>
              ) : isCommunityInactive ? (
                <Button disabled size="lg" className="w-full sm:w-auto">
                  Kulüp aktif olmadığı için katılım kapalı
                </Button>
              ) : (
                <>
                  <Button
                    size="lg"
                    className="w-full"
                    disabled={isBusy}
                    onClick={() => join.mutate(event.id)}
                  >
                    {join.isPending ? 'Gönderiliyor…' : 'Katılım isteği gönder'}
                  </Button>
                  {isFull && (
                    <p className="text-caption mt-3 text-neutral-600">
                      Kontenjan dolu. İsteğiniz yine de iletilir, yer açılırsa
                      değerlendirilir.
                    </p>
                  )}
                </>
              )}
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-4 text-[17px] leading-[1.75] text-neutral-800">
            {event.description
              .split('\n\n')
              .map((paragraph: string, index: number) => (
                <p key={index}>{paragraph}</p>
              ))}
          </div>

          <AttachmentList attachments={attachments} />

          {participants && participants.length > 0 && (
            <section className="mt-8">
              <h2 className="text-caption font-semibold text-neutral-800">
                Katılımcılar ({participants.length})
              </h2>

              <ul className="mt-3 flex flex-col gap-2">
                {participants.map((participant) => {
                  const user = participantUsers?.[participant.userId]
                  const name = user?.name ?? 'Üye'

                  return (
                    <li
                      key={participant.id}
                      className="flex items-center gap-3 rounded-md border border-neutral-200 bg-white px-3.5 py-2.5"
                    >
                      <Avatar
                        initials={getInitials(name)}
                        src={assetUrl(user?.picture)}
                        name={name}
                        size="sm"
                        className="h-8 w-8 text-[12px]"
                      />

                      <p className="text-body flex-1 truncate font-medium text-neutral-900">
                        {name}
                      </p>

                      {canEdit && participant.status === 'requested' && (
                        <div className="flex gap-1.5">
                          <Button
                            type="button"
                            size="sm"
                            className="p-2"
                            aria-label="Katılımı onayla"
                            title="Onayla"
                            disabled={updateParticipant.isPending}
                            onClick={() =>
                              updateParticipant.mutate({
                                eventId: event.id,
                                userId: participant.userId,
                                status: 'joined',
                              })
                            }
                          >
                            <Check size={14} aria-hidden="true" />
                          </Button>
                          <Button
                            type="button"
                            variant="secondary"
                            size="sm"
                            className="p-2"
                            aria-label="Katılımı reddet"
                            title="Reddet"
                            disabled={updateParticipant.isPending}
                            onClick={() =>
                              updateParticipant.mutate({
                                eventId: event.id,
                                userId: participant.userId,
                                status: 'rejected',
                              })
                            }
                          >
                            <X size={14} aria-hidden="true" />
                          </Button>
                        </div>
                      )}

                      {canEdit && participant.status === 'joined' && (
                        <Button
                          type="button"
                          variant="secondary"
                          size="sm"
                          className="p-2"
                          aria-label="Gelmedi olarak işaretle"
                          title="Gelmedi olarak işaretle"
                          disabled={updateParticipant.isPending}
                          onClick={() =>
                            updateParticipant.mutate({
                              eventId: event.id,
                              userId: participant.userId,
                              status: 'no_show',
                            })
                          }
                        >
                          <Clock size={14} aria-hidden="true" />
                        </Button>
                      )}

                      {canEdit && participant.status === 'no_show' && (
                        <Button
                          type="button"
                          size="sm"
                          className="p-2"
                          aria-label="Katıldı olarak işaretle"
                          title="Katıldı olarak işaretle"
                          disabled={updateParticipant.isPending}
                          onClick={() =>
                            updateParticipant.mutate({
                              eventId: event.id,
                              userId: participant.userId,
                              status: 'joined',
                            })
                          }
                        >
                          <Check size={14} aria-hidden="true" />
                        </Button>
                      )}

                      <Badge tone={participantStatusTones[participant.status]}>
                        {participantStatusLabels[participant.status]}
                      </Badge>
                    </li>
                  )
                })}
              </ul>
            </section>
          )}

          {canEdit && (
            <div className="mt-8 flex gap-2 border-t border-neutral-200 pt-6">
              <Link to={paths.communities.editEvent(slug!, event.id)}>
                <Button type="button" variant="secondary" size="sm">
                  Düzenle
                </Button>
              </Link>

              {confirmingDelete ? (
                <>
                  <Button
                    type="button"
                    variant="danger"
                    size="sm"
                    disabled={remove.isPending}
                    onClick={() =>
                      remove.mutate(event.id, {
                        onSuccess: () =>
                          navigate(paths.communities.events(slug!)),
                      })
                    }
                  >
                    {remove.isPending ? 'Siliniyor…' : 'Silmeyi onayla'}
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => setConfirmingDelete(false)}
                  >
                    Vazgeç
                  </Button>
                </>
              ) : (
                <Button
                  type="button"
                  variant="danger"
                  size="sm"
                  onClick={() => setConfirmingDelete(true)}
                >
                  Sil
                </Button>
              )}
            </div>
          )}
        </article>
      </div>
    </Container>
  )
}
