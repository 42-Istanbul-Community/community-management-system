import { FortyTwoIcon, GoogleIcon } from '@/components/icons'
import { Button } from '@/components/ui'
import { startFortyTwoLogin, startGoogleLogin } from '@/features/auth/lib'

export function OAuthButtons() {
  return (
    <div className="flex gap-3">
      <Button
        variant="secondary"
        type="button"
        aria-label="42 ile devam et"
        className="flex-1 cursor-pointer"
        onClick={startFortyTwoLogin}
      >
        <FortyTwoIcon />
      </Button>

      <Button
        variant="secondary"
        type="button"
        aria-label="Google ile devam et"
        className="flex-1 cursor-pointer"
        onClick={startGoogleLogin}
      >
        <GoogleIcon />
      </Button>
    </div>
  )
}
