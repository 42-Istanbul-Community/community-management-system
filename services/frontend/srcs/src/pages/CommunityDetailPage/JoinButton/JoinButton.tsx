import { Link } from 'react-router'

import { Button, buttonStyles } from '@/components/ui'
import { paths } from '@/routes/paths'
import { useAuthStore } from '@/stores'
import type { JoinButtonProps } from './JoinButton.types';

const labels = {
  open: 'Katıl',
  restricted: 'Başvur',
  closed: 'Katılıma kapalı',
} as const

export function JoinButton({ access }: JoinButtonProps) {
  const token = useAuthStore((state) => state.token)

  if (access === 'closed') {
    return (
      <Button disabled className="w-full sm:w-auto">
        {labels.closed}
      </Button>
    )
  }

  if (!token) {
    return (
      <Link
        to={paths.login}
        className={buttonStyles({ className: 'w-full sm:w-auto' })}
      >
        Katılmak için giriş yapın
      </Link>
    )
  }

  return <Button className="w-full sm:w-auto">{labels[access]}</Button>
}
