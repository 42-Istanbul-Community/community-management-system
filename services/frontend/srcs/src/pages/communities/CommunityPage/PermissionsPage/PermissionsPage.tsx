import type { FormEventHandler } from 'react'
import { useState } from 'react'

import { Alert, Button, Forbidden } from '@/components/ui'
import { useCommunityContext } from '@/features/communities/hooks'
import type { ModeratorPermission } from '@/features/membership/api'
import {
  useCommunityPermissions,
  useModeratorPermissions,
  useUpdateModeratorPermissions,
} from '@/features/membership/hooks'

const permissionLabels: Record<ModeratorPermission, string> = {
  seeRequests: 'Başvuruları görebilir',
  resolveRequests: 'Başvuruları onaylayıp reddedebilir',
  kickMembers: 'Üyeleri kulüpten atabilir',
  setPermissions: 'Moderatör izinlerini değiştirebilir',
  setVisibility: 'Kulüp görünürlüğünü değiştirebilir',
  setAccessibility: 'Kulüp erişim türünü değiştirebilir',
  setDescription: 'Kulüp açıklamasını değiştirebilir',
  setRules: 'Kulüp tüzüğünü değiştirebilir',
  setStatus: 'Kulüp durumunu değiştirebilir',
  setPicture: 'Kulüp profil resmini değiştirebilir',
  setBackgroundPicture: 'Kulüp kapak resmini değiştirebilir',
  setTags: 'Kulüp etiketlerini değiştirebilir',
}

const allPermissions = Object.keys(permissionLabels) as ModeratorPermission[]

export function PermissionsPage() {
  const { community } = useCommunityContext()

  const { canAdmin, isPending: isRolePending } = useCommunityPermissions(
    community.id,
  )
  const { data: permissions, isPending } = useModeratorPermissions(community.id)

  if (isRolePending || isPending) {
    return <p className="text-body text-neutral-600">Yükleniyor...</p>
  }

  if (!canAdmin) {
    return <Forbidden />
  }

  return (
    <PermissionsForm
      communityId={community.id}
      initialPermissions={permissions ?? []}
    />
  )
}

function PermissionsForm({
  communityId,
  initialPermissions,
}: {
  communityId: string
  initialPermissions: ModeratorPermission[]
}) {
  const update = useUpdateModeratorPermissions(communityId)
  const [selected, setSelected] = useState(initialPermissions)

  function toggle(permission: ModeratorPermission) {
    setSelected((current) =>
      current.includes(permission)
        ? current.filter((item) => item !== permission)
        : [...current, permission],
    )
  }

  const handleSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault()
    update.mutate(selected)
  }

  return (
    <div className="flex flex-col gap-6">
      <p className="text-body-lg text-neutral-700">
        Bu kulübün moderatörlerinin neler yapabileceğini seçin.
      </p>

      {update.isSuccess && (
        <Alert tone="success">Değişiklikler kaydedildi.</Alert>
      )}
      {update.error && <Alert tone="danger">{update.error.message}</Alert>}

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div className="rounded-lg border border-neutral-200 bg-white p-6">
          <div className="flex flex-col gap-3">
            {allPermissions.map((permission) => (
              <label
                key={permission}
                className="text-body flex items-center gap-2.5 text-neutral-800"
              >
                <input
                  type="checkbox"
                  checked={selected.includes(permission)}
                  onChange={() => toggle(permission)}
                  className="checked:border-primary-600 checked:bg-primary-600 h-4 w-4 appearance-none rounded border border-neutral-300"
                />
                {permissionLabels[permission]}
              </label>
            ))}
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={update.isPending}>
            {update.isPending ? 'Kaydediliyor…' : 'Değişiklikleri kaydet'}
          </Button>
        </div>
      </form>
    </div>
  )
}
