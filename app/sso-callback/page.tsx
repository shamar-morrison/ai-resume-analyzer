import { AuthenticateWithRedirectCallback } from '@clerk/nextjs'

export default function SSOCallback() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <div className="mb-4">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
        </div>
        <p className="text-lg text-muted-foreground">Completing authentication...</p>
        <AuthenticateWithRedirectCallback />
        <div id="clerk-captcha" />
      </div>
    </div>
  )
}
