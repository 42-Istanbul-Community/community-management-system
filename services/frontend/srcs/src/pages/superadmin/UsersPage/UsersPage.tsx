import { useEffect, useState } from 'react'
import { Link } from 'react-router'

import {
  Alert,
  Avatar,
  Button,
  Container,
  EmptyState,
  SearchInput,
} from '@/components/ui'
import { useDeleteUser, useUserList } from '@/features/auth/hooks'
import { useDocumentTitle } from '@/hooks'
import { assetUrl, getInitials } from '@/lib'
import { paths } from '@/routes/paths'
import { ArrowLeft, CloudOff, Trash2, Users } from 'lucide-react'

export function UsersPage() {
  useDocumentTitle('Kullanıcılar')

  const [query, setQuery] = useState('')
  const [text, setText] = useState('')
  const [page, setPage] = useState(1)
  const [confirmingId, setConfirmingId] = useState<string | null>(null)

  useEffect(() => {
    const timeout = setTimeout(() => {
      setText(query)
      setPage(1)
    }, 400)

    return () => clearTimeout(timeout)
  }, [query])

  const { data, isPending, isError } = useUserList(page, text)
  const deleteUser = useDeleteUser()

  const users = data?.users ?? []

  function handleDelete(userId: string) {
    setConfirmingId(null)
    deleteUser.mutate(userId)
  }

  return (
    <Container className="py-14">
      <div className="mx-auto max-w-160">
        <Link
          to={paths.superadmin.root}
          className="text-caption hover:text-primary-700 inline-flex items-center gap-1.5 font-medium text-neutral-600 transition-colors"
        >
          <ArrowLeft size={15} aria-hidden="true" />
          Yönetime dön
        </Link>

        <h1 className="font-display text-h2 mt-5 font-semibold tracking-[-0.02em]">
          Kullanıcılar
        </h1>

        {deleteUser.error && (
          <Alert tone="danger" className="mt-6">
            {deleteUser.error.message}
          </Alert>
        )}

        <div className="mt-8">
          <SearchInput
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onClear={() => setQuery('')}
            placeholder="İsme göre ara..."
          />
        </div>

        <div className="mt-5">
          {isPending ? (
            <p className="text-body text-neutral-600">Yükleniyor...</p>
          ) : isError ? (
            <EmptyState
              icon={<CloudOff size={22} aria-hidden="true" />}
              title="Kullanıcılar yüklenemedi"
              description="Sunucuya ulaşılamadı. Lütfen daha sonra tekrar deneyin."
            />
          ) : users.length === 0 ? (
            <EmptyState
              icon={<Users size={22} aria-hidden="true" />}
              title="Kullanıcı bulunamadı"
              description="Aradığınız kriterlere uygun kullanıcı yok."
            />
          ) : (
            <>
              <ul className="flex flex-col gap-3">
                {users.map((user) => (
                  <li
                    key={user.id}
                    className="flex items-center justify-between gap-3 rounded-lg border border-neutral-200 bg-white p-4"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <Avatar
                        initials={getInitials(user.name)}
                        src={assetUrl(user.picture)}
                        name={user.name}
                        size="sm"
                      />
                      <p className="text-body truncate font-medium text-neutral-900">
                        {user.name}
                      </p>
                    </div>

                    {confirmingId === user.id ? (
                      <div className="flex shrink-0 gap-2">
                        <Button
                          variant="danger"
                          size="sm"
                          disabled={deleteUser.isPending}
                          onClick={() => handleDelete(user.id)}
                        >
                          {deleteUser.isPending &&
                          deleteUser.variables === user.id
                            ? 'Siliniyor…'
                            : 'Silmeyi onayla'}
                        </Button>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => setConfirmingId(null)}
                        >
                          Vazgeç
                        </Button>
                      </div>
                    ) : (
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => setConfirmingId(user.id)}
                      >
                        <Trash2 size={15} aria-hidden="true" />
                        Sil
                      </Button>
                    )}
                  </li>
                ))}
              </ul>

              {data && data.maxPage > 1 && (
                <div className="mt-5 flex items-center justify-between">
                  <Button
                    variant="secondary"
                    size="sm"
                    disabled={page <= 1}
                    onClick={() => setPage((current) => current - 1)}
                  >
                    Önceki
                  </Button>

                  <p className="text-caption text-neutral-500">
                    Sayfa {data.page} / {data.maxPage}
                  </p>

                  <Button
                    variant="secondary"
                    size="sm"
                    disabled={page >= data.maxPage}
                    onClick={() => setPage((current) => current + 1)}
                  >
                    Sonraki
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </Container>
  )
}
