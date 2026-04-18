'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useUser } from '../../utils/userContext'

const highlights = [
  'Minimalist battle-first product shell',
  'Secure cookie-based authentication',
  'Ready for rooms and live scoring',
]

const Signup = () => {
  const router = useRouter()
  const { signUp, isAuthenticated, isLoading } = useUser()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  })
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace('/')
    }
  }, [isAuthenticated, isLoading, router])

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((current) => ({ ...current, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      await signUp(formData)
      router.push('/')
    } catch (submissionError) {
      setError(submissionError.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="grain grid min-h-screen px-6 py-6 sm:px-8 sm:py-8">
      <section className="section-shell mx-auto grid w-full max-w-7xl flex-1 overflow-hidden rounded-[36px] border border-white/8 bg-white/[0.02] shadow-[0_30px_140px_rgba(0,0,0,0.35)] lg:grid-cols-[1.1fr_0.9fr]">
        <div className="flex flex-col justify-between border-b soft-divider p-8 sm:p-10 lg:border-b-0 lg:border-r">
          <div className="fade-up">
            <p className="eyebrow text-xs text-[#d8b48a]">Signup / Algora</p>
            <h1 className="hero-title mt-8 max-w-2xl text-5xl font-semibold text-white sm:text-6xl">
              Create the first player account for your arena.
            </h1>
            <p className="mt-7 max-w-xl text-base leading-8 muted-copy">
              This profile becomes the base identity for private matches, invitations, and future
              ranking systems.
            </p>
          </div>

          <div className="fade-up mt-10 space-y-4 [animation-delay:120ms]">
            {highlights.map((item) => (
              <div
                key={item}
                className="flex items-center gap-3 rounded-[20px] border border-white/8 bg-white/[0.03] px-4 py-4"
              >
                <span className="h-2.5 w-2.5 rounded-full bg-[#d8b48a]" />
                <p className="text-sm text-white/85">{item}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center p-6 sm:p-8 lg:p-10">
          <section className="panel-strong fade-up w-full rounded-[30px] p-8 sm:p-10">
            <p className="eyebrow text-xs text-[#d8b48a]">Create account</p>
            <h2 className="mt-5 text-3xl font-semibold text-white">Sign up</h2>
            <p className="mt-3 text-sm leading-7 muted-copy">
              Your account will be created and signed in immediately after the backend confirms it.
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <label className="block">
                <span className="mb-2 block text-sm text-white/82">Name</span>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  minLength={2}
                  className="w-full rounded-[20px] border border-white/10 bg-white/[0.04] px-4 py-3.5 text-white outline-none transition focus:border-[#d8b48a]/60 focus:bg-white/[0.06]"
                  placeholder="Charan"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm text-white/82">Email</span>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full rounded-[20px] border border-white/10 bg-white/[0.04] px-4 py-3.5 text-white outline-none transition focus:border-[#d8b48a]/60 focus:bg-white/[0.06]"
                  placeholder="you@algora.dev"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm text-white/82">Password</span>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength={8}
                  className="w-full rounded-[20px] border border-white/10 bg-white/[0.04] px-4 py-3.5 text-white outline-none transition focus:border-[#d8b48a]/60 focus:bg-white/[0.06]"
                  placeholder="At least 8 characters"
                />
              </label>

              {error ? (
                <p className="rounded-[20px] border border-[#ef8b83]/20 bg-[#ef8b83]/10 px-4 py-3 text-sm text-[#ffd1cb]">
                  {error}
                </p>
              ) : null}

              <button
                type="submit"
                disabled={isSubmitting}
                className="solid-button w-full rounded-[20px] px-5 py-3.5 font-semibold transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? 'Creating account...' : 'Create account'}
              </button>
            </form>

            <p className="mt-6 text-sm muted-copy">
              Already registered?{' '}
              <Link href="/auth/signin" className="font-semibold text-white transition hover:text-[#f3d6b4]">
                Sign in instead
              </Link>
            </p>
          </section>
        </div>
      </section>
    </main>
  )
}

export default Signup
