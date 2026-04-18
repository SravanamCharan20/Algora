'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useUser } from './utils/userContext'
import {
  AmbientPage,
  BrandMark,
  DetailRow,
  MiniStat,
  Panel,
  SubPanel,
  bodyTextClass,
  eyebrowClass,
  headlineClass,
  primaryButtonClass,
  secondaryButtonClass,
  shellClass,
} from './components/site-ui'

const publicStats = [
  { label: 'Privacy', value: 'Invite only' },
  { label: 'Ranking', value: 'Live board' },
  { label: 'Entry', value: 'Fast auth' },
]

const roomBoard = [
  { label: 'Room', value: 'Sprint / 04' },
  { label: 'Format', value: '1 prompt / 3 coders' },
  { label: 'Window', value: '30 minute run' },
]

const scoreBoard = [
  { label: 'Ava', value: '118' },
  { label: 'Charan', value: '104' },
  { label: 'Mia', value: '089' },
]

const memberStats = [
  { label: 'Identity', value: 'Account ready' },
  { label: 'Session', value: 'Authenticated' },
  { label: 'Mode', value: 'Private rooms' },
]

const Home = () => {
  const router = useRouter()
  const { user, isLoading, isAuthenticated, signOut } = useUser()
  const [isSigningOut, setIsSigningOut] = useState(false)
  const initials = user?.name
    ?.trim()
    ?.split(/\s+/)
    ?.map((part) => part[0])
    ?.join('')
    ?.slice(0, 2)
    ?.toUpperCase() || 'AL'

  const handleSignOut = async () => {
    if (isSigningOut) {
      return
    }

    setIsSigningOut(true)

    try {
      await signOut()
      router.replace('/auth/signin')
    } finally {
      setIsSigningOut(false)
    }
  }

  if (isLoading) {
    return (
      <AmbientPage>
        <main className={`${shellClass} flex min-h-screen items-center justify-center py-10`}>
          <Panel className="w-full max-w-3xl px-8 py-10 text-center sm:px-12 sm:py-12">
            <p className={eyebrowClass}>Loading</p>
            <h1 className={`${headlineClass} mt-5 text-4xl leading-none sm:text-5xl`}>
              Preparing the workspace.
            </h1>
          </Panel>
        </main>
      </AmbientPage>
    )
  }

  if (!isAuthenticated) {
    return (
      <AmbientPage>
        <main className={`${shellClass} min-h-screen py-6 sm:py-8`}>
          <header className="flex flex-wrap items-center justify-between gap-4">
            <BrandMark />
            <div className="flex flex-wrap gap-3">
              <Link href="/auth/signin" className={secondaryButtonClass}>
                Sign in
              </Link>
              <Link href="/auth/signup" className={primaryButtonClass}>
                Create account
              </Link>
            </div>
          </header>

          <section className="grid gap-10 py-14 lg:grid-cols-[minmax(0,1.08fr)_minmax(420px,0.92fr)] lg:items-center lg:gap-14 lg:py-20">
            <div className="max-w-4xl">
              <p className={eyebrowClass}>Private coding battles</p>
              <h1
                className={`${headlineClass} mt-6 max-w-5xl text-5xl leading-[0.9] sm:text-6xl lg:text-[6.25rem]`}
              >
                Real-time matches, minus the noise.
              </h1>
              <p className={`${bodyTextClass} mt-6 max-w-2xl`}>
                Invite your people, start the room, and let the leaderboard do the
                rest.
              </p>

              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                <Link href="/auth/signup" className={primaryButtonClass}>
                  Create account
                </Link>
                <Link href="/auth/signin" className={secondaryButtonClass}>
                  Sign in
                </Link>
              </div>

              <div className="mt-12 grid gap-4 sm:grid-cols-3">
                {publicStats.map((item) => (
                  <MiniStat key={item.label} label={item.label} value={item.value} />
                ))}
              </div>
            </div>

            <Panel className="overflow-hidden p-0">
              <div className="border-b border-black/[0.08] px-7 py-6 sm:px-8">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className={eyebrowClass}>Live room</p>
                    <h2 className={`${headlineClass} mt-4 text-3xl leading-none sm:text-[2.65rem]`}>
                      Sprint / 04
                    </h2>
                  </div>
                  <span className="rounded-full border border-black/[0.08] bg-black/[0.03] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.28em] text-black/45">
                    Invite only
                  </span>
                </div>
              </div>

              <div className="grid gap-5 px-7 py-7 sm:px-8">
                <SubPanel className="p-5">
                  <div className="space-y-3">
                    {roomBoard.map((item) => (
                      <DetailRow key={item.label} label={item.label} value={item.value} />
                    ))}
                  </div>
                </SubPanel>

                <div className="grid gap-3 sm:grid-cols-3">
                  {scoreBoard.map((entry) => (
                    <SubPanel key={entry.label} className="p-4">
                      <p className={eyebrowClass}>{entry.label}</p>
                      <p className="mt-3 text-2xl font-semibold tracking-[-0.06em] text-[#0f1115]">
                        {entry.value}
                      </p>
                    </SubPanel>
                  ))}
                </div>
              </div>
            </Panel>
          </section>
        </main>
      </AmbientPage>
    )
  }

  return (
    <AmbientPage>
      <main className={`${shellClass} min-h-screen py-6 sm:py-8`}>
        <header className="flex flex-wrap items-center justify-between gap-4">
          <BrandMark compact />

          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-3 rounded-[20px] border border-black/[0.08] bg-white/85 px-4 py-3 shadow-[0_18px_40px_-34px_rgba(15,23,42,0.3)] sm:flex">
              <span className="flex h-10 w-10 items-center justify-center rounded-[14px] bg-[#f5f3ee] text-sm font-semibold text-[#0f1115]">
                {initials}
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-[#0f1115]">{user?.name}</p>
                <p className="truncate text-xs text-black/45">{user?.email}</p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleSignOut}
              disabled={isSigningOut}
              className={secondaryButtonClass}
            >
              {isSigningOut ? 'Signing out...' : 'Sign out'}
            </button>
          </div>
        </header>

        <section className="grid gap-8 py-14 lg:grid-cols-[minmax(0,1.08fr)_420px] lg:gap-10 lg:py-16">
          <div className="space-y-8">
            <div className="max-w-4xl">
              <p className={eyebrowClass}>Workspace</p>
              <h1 className={`${headlineClass} mt-6 text-5xl leading-[0.9] sm:text-6xl lg:text-[5.7rem]`}>
                Control room ready.
              </h1>
              <p className={`${bodyTextClass} mt-6 max-w-2xl`}>
                Signed in as {user?.email}. Private rooms and live ranking are ready.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {memberStats.map((item) => (
                <MiniStat key={item.label} label={item.label} value={item.value} />
              ))}
            </div>

            <Panel className="overflow-hidden p-0">
              <div className="grid gap-0 lg:grid-cols-[minmax(0,1fr)_280px]">
                <div className="border-b border-black/[0.08] px-7 py-7 lg:border-b-0 lg:border-r sm:px-8">
                  <p className={eyebrowClass}>Room profile</p>
                  <h2 className={`${headlineClass} mt-4 text-3xl leading-none sm:text-[2.55rem]`}>
                    Private match defaults.
                  </h2>

                  <div className="mt-7 space-y-3">
                    <DetailRow label="Access" value="Invite controlled" />
                    <DetailRow label="Ranking" value="Live updates" />
                    <DetailRow label="Feedback" value="Instant result" />
                    <DetailRow label="Session" value="Authenticated" />
                  </div>
                </div>

                <div className="bg-black/[0.02] px-7 py-7 sm:px-8">
                  <p className={eyebrowClass}>Board</p>
                  <div className="mt-6 space-y-3">
                    {scoreBoard.map((entry) => (
                      <div
                        key={entry.label}
                        className="flex items-center justify-between rounded-[18px] border border-black/[0.07] bg-white/90 px-4 py-4"
                      >
                        <span className="text-sm font-semibold text-[#0f1115]">{entry.label}</span>
                        <span className="text-sm font-semibold tracking-[0.18em] text-black/52">
                          {entry.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Panel>
          </div>

          <Panel className="h-fit p-7 sm:p-8">
            <p className={eyebrowClass}>Account</p>

            <div className="mt-6 flex items-center gap-4 rounded-[24px] border border-black/[0.08] bg-[#f7f4ee] p-5">
              <div className="flex h-14 w-14 items-center justify-center rounded-[18px] bg-white text-base font-semibold text-[#0f1115]">
                {initials}
              </div>
              <div className="min-w-0">
                <p className="truncate text-xl font-semibold tracking-[-0.05em] text-[#0f1115]">
                  {user?.name || 'Member'}
                </p>
                <p className="truncate text-sm text-black/48">{user?.email}</p>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <DetailRow label="State" value="Signed in" />
              <DetailRow label="Surface" value="Production ready" />
              <DetailRow label="Rooms" value="Private format" />
            </div>
          </Panel>
        </section>
      </main>
    </AmbientPage>
  )
}

export default Home
