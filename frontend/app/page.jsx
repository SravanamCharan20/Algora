'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useUser } from './utils/userContext'

const statCards = [
  { label: 'Private rooms', value: 'Invite-only', tone: 'text-[#f3d6b4]' },
  { label: 'Battle setup', value: 'Under 60s', tone: 'text-[#95c8b4]' },
  { label: 'Scoring flow', value: 'Live ready', tone: 'text-white' },
]

const featureCards = [
  {
    label: 'Identity',
    title: 'Secure player onboarding',
    copy: 'Email signup, persistent sessions, and protected state restoration are already wired.',
  },
  {
    label: 'Match flow',
    title: 'Built for friend challenges',
    copy: 'The next layer can move straight into room invites, duel setup, and match orchestration.',
  },
  {
    label: 'Product base',
    title: 'Minimal, premium interface',
    copy: 'A calmer palette, sharper spacing, and more editorial rhythm make the app feel product-ready.',
  },
]

const Home = () => {
  const router = useRouter()
  const { user, isLoading, isAuthenticated, signOut } = useUser()
  const [isSigningOut, setIsSigningOut] = useState(false)

  const handleSignOut = async () => {
    setIsSigningOut(true)
    await signOut()
    setIsSigningOut(false)
    router.push('/auth/signin')
  }

  if (isLoading) {
    return (
      <main className="grain grid min-h-screen place-items-center px-6 py-12">
        <div className="panel flex w-full max-w-md items-center justify-center rounded-[32px] px-8 py-14 text-center">
          <div>
            <p className="eyebrow text-xs text-[#d8b48a]">Session Check</p>
            <h1 className="mt-4 text-3xl font-semibold text-white">Preparing your battle desk...</h1>
          </div>
        </div>
      </main>
    )
  }

  if (!isAuthenticated) {
    return (
      <main className="grain grid-line min-h-screen px-6 py-6 sm:px-8 sm:py-8">
        <section className="section-shell mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-7xl flex-col rounded-[36px] border border-white/8 bg-white/[0.02] p-6 shadow-[0_30px_140px_rgba(0,0,0,0.35)] sm:p-8 lg:p-10">
          <header className="fade-up flex flex-col gap-6 border-b soft-divider pb-8 md:flex-row md:items-center md:justify-between">
            <div className="space-y-3">
              <p className="eyebrow text-xs text-[#d8b48a]">Algora / Private coding battles</p>
              <p className="max-w-xl text-sm muted-copy">
                Designed for curated friend-vs-friend matchups, not noisy public leaderboards.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/auth/signin"
                className="outline-button rounded-full px-5 py-2.5 text-sm text-white transition hover:border-[#d8b48a]/45 hover:bg-white/[0.05]"
              >
                Sign in
              </Link>
              <Link
                href="/auth/signup"
                className="solid-button rounded-full px-5 py-2.5 text-sm font-semibold transition hover:scale-[1.02]"
              >
                Create account
              </Link>
            </div>
          </header>

          <div className="grid flex-1 gap-8 py-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
            <div className="fade-up">
              <div className="flex flex-wrap gap-3">
                <span className="rounded-full border border-[#d8b48a]/30 bg-[#d8b48a]/10 px-4 py-2 text-xs text-[#f3d6b4]">
                  End-to-end auth is live
                </span>
                <span className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-xs text-white/75">
                  Built for rooms, rankings, and match flow
                </span>
              </div>

              <h1 className="hero-title mt-8 max-w-4xl text-5xl font-semibold text-white sm:text-6xl lg:text-7xl">
                A more serious home for coding battles between friends.
              </h1>

              <p className="mt-7 max-w-2xl text-lg leading-8 muted-copy">
                Algora now has a functioning auth foundation and a cleaner product surface. The
                interface leans premium and minimal so future battle features can sit on top of it
                without feeling like a hackathon prototype.
              </p>

              <div className="mt-10 flex flex-wrap gap-4">
                <Link
                  href="/auth/signup"
                  className="solid-button rounded-full px-6 py-3 font-semibold transition hover:scale-[1.02]"
                >
                  Start a battle-ready account
                </Link>
                <Link
                  href="/auth/signin"
                  className="outline-button rounded-full px-6 py-3 text-white transition hover:border-[#d8b48a]/45 hover:bg-white/[0.05]"
                >
                  Continue to signin
                </Link>
              </div>

              <div className="mt-12 grid gap-4 md:grid-cols-3">
                {statCards.map((card) => (
                  <div key={card.label} className="rounded-[24px] border border-white/8 bg-white/[0.03] p-5">
                    <p className="eyebrow text-[11px] text-white/45">{card.label}</p>
                    <p className={`metric-value mt-4 text-3xl font-semibold ${card.tone}`}>
                      {card.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <aside className="fade-up space-y-5 [animation-delay:120ms]">
              <div className="spotlight-card rounded-[32px] p-7 sm:p-8">
                <p className="eyebrow text-xs text-[#d8b48a]">Launch stack</p>
                <div className="mt-8 space-y-8">
                  <div className="border-b soft-divider pb-6">
                    <p className="text-4xl font-semibold text-white">01</p>
                    <h2 className="mt-4 text-2xl font-semibold text-white">Signed sessions</h2>
                    <p className="mt-3 text-sm leading-7 muted-copy">
                      Players can register, sign in, refresh, and stay authenticated with secure
                      cookies.
                    </p>
                  </div>
                  <div className="border-b soft-divider pb-6">
                    <p className="text-4xl font-semibold text-white">02</p>
                    <h2 className="mt-4 text-2xl font-semibold text-white">Premium shell</h2>
                    <p className="mt-3 text-sm leading-7 muted-copy">
                      The product now feels tighter, calmer, and closer to a polished platform than
                      a starter template.
                    </p>
                  </div>
                  <div>
                    <p className="text-4xl font-semibold text-white">03</p>
                    <h2 className="mt-4 text-2xl font-semibold text-white">Ready for matches</h2>
                    <p className="mt-3 text-sm leading-7 muted-copy">
                      Room creation, problem flow, timers, and scoreboards can plug directly into
                      this base.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
                {featureCards.map((card) => (
                  <div key={card.label} className="panel rounded-[26px] p-6">
                    <p className="eyebrow text-[11px] text-white/45">{card.label}</p>
                    <h3 className="mt-4 text-xl font-semibold text-white">{card.title}</h3>
                    <p className="mt-3 text-sm leading-7 muted-copy">{card.copy}</p>
                  </div>
                ))}
              </div>
            </aside>
          </div>
        </section>
      </main>
    )
  }

  return (
    <main className="grain grid-line min-h-screen px-6 py-6 sm:px-8 sm:py-8">
      <section className="section-shell mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-7xl flex-col rounded-[36px] border border-white/8 bg-white/[0.02] p-6 shadow-[0_30px_140px_rgba(0,0,0,0.35)] sm:p-8 lg:p-10">
        <header className="fade-up flex flex-col gap-6 border-b soft-divider pb-8 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow text-xs text-[#d8b48a]">Command center</p>
            <h1 className="hero-title mt-5 max-w-4xl text-4xl font-semibold text-white sm:text-5xl lg:text-6xl">
              {user.name}, your private battle arena is live.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 muted-copy">
              Your account is authenticated end to end and the interface is ready for the next
              product layer: rooms, invitations, rounds, and competitive scoring.
            </p>
          </div>
          <button
            type="button"
            onClick={handleSignOut}
            disabled={isSigningOut}
            className="outline-button rounded-full px-5 py-3 text-sm font-medium text-white transition hover:border-[#d8b48a]/45 hover:bg-white/[0.05] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSigningOut ? 'Signing out...' : 'Sign out'}
          </button>
        </header>

        <div className="grid gap-8 py-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="fade-up grid gap-5 md:grid-cols-2">
            <div className="spotlight-card rounded-[30px] p-7 md:col-span-2">
              <p className="eyebrow text-xs text-[#d8b48a]">Profile</p>
              <div className="mt-8 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
                <div>
                  <p className="text-4xl font-semibold text-white">{user.name}</p>
                  <p className="mt-3 break-all text-sm muted-copy">{user.email}</p>
                </div>
                <div className="rounded-[22px] border border-[#95c8b4]/25 bg-[#95c8b4]/10 px-5 py-4 text-sm text-[#c9f0e0]">
                  Session active and restored
                </div>
              </div>
            </div>

            <div className="panel rounded-[26px] p-6">
              <p className="eyebrow text-[11px] text-white/45">Auth status</p>
              <p className="metric-value mt-5 text-4xl font-semibold text-white">Secure</p>
              <p className="mt-4 text-sm leading-7 muted-copy">
                JWT cookie auth is protecting player state between refreshes.
              </p>
            </div>

            <div className="panel rounded-[26px] p-6">
              <p className="eyebrow text-[11px] text-white/45">Next feature</p>
              <p className="metric-value mt-5 text-4xl font-semibold text-[#f3d6b4]">Rooms</p>
              <p className="mt-4 text-sm leading-7 muted-copy">
                Invite flows and live head-to-head battle setup are the natural next step.
              </p>
            </div>
          </div>

          <aside className="fade-up space-y-5 [animation-delay:120ms]">
            <div className="panel rounded-[30px] p-7">
              <p className="eyebrow text-xs text-[#d8b48a]">System readiness</p>
              <div className="mt-6 space-y-5">
                <div className="flex items-start justify-between gap-4 border-b soft-divider pb-5">
                  <div>
                    <p className="text-lg font-medium text-white">Player authentication</p>
                    <p className="mt-2 text-sm muted-copy">Signup, signin, logout, session restore.</p>
                  </div>
                  <span className="text-sm text-[#95c8b4]">Ready</span>
                </div>
                <div className="flex items-start justify-between gap-4 border-b soft-divider pb-5">
                  <div>
                    <p className="text-lg font-medium text-white">UI foundation</p>
                    <p className="mt-2 text-sm muted-copy">Landing, auth screens, and dashboard shell.</p>
                  </div>
                  <span className="text-sm text-[#95c8b4]">Ready</span>
                </div>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-lg font-medium text-white">Competitive flow</p>
                    <p className="mt-2 text-sm muted-copy">Rooms, problems, rounds, and scoreboard logic.</p>
                  </div>
                  <span className="text-sm text-[#f3d6b4]">Next</span>
                </div>
              </div>
            </div>

            <div className="panel rounded-[30px] p-7">
              <p className="eyebrow text-xs text-[#d8b48a]">Design direction</p>
              <p className="mt-5 text-2xl font-semibold text-white">
                Minimal contrast, editorial spacing, and warmer highlights.
              </p>
              <p className="mt-4 text-sm leading-7 muted-copy">
                The product now leans toward a premium platform feel rather than a generic developer
                dashboard, while still staying practical for future battle workflows.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </main>
  )
}

export default Home
