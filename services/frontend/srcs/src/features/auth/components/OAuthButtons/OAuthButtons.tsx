import { FortyTwoIcon, GoogleIcon } from '@/components/icons'
import { Button } from '@/components/ui'

export function OAuthButtons() {
  return (
    <div className="flex gap-3">
      <Button
        variant="secondary"
        type="button"
        aria-label="42 ile devam et"
        className="flex-1 cursor-pointer"
      >
        <FortyTwoIcon />
      </Button>

      <Button
        variant="secondary"
        type="button"
        aria-label="Google ile devam et"
        className="flex-1 cursor-pointer"
        disabled
      >
        <GoogleIcon />
      </Button>
    </div>
  )
}
