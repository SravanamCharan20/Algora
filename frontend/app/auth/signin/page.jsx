'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useUser } from '../../utils/userContext'
import {
  AmbientPage,
  BrandMark,
  MiniStat,
  Panel,
  bodyTextClass,
  eyebrowClass,
  fieldLabelClass,
  headlineClass,
  inputClass,
  passwordToggleClass,
  primaryButtonClass,
  secondaryButtonClass,
  shellClass,
  textLinkClass,
} from '../../components/site-ui'

const modeContent = {
  user: {
    eyebrow: 'User sign in',
    headline: 'Back to the room.',
    copy: 'Use your account to continue into private matches.',
    stats: [
      { label: 'Privacy', value: 'Invite only' },
      { label: 'Ranking', value: 'Live board' },
      { label: 'Entry', value: 'Fast access' },
    ],
    panelTitle: 'Enter your account.',
  },
  admin: {
    eyebrow: 'Admin sign in',
    headline: 'Open contest control.',
    copy: 'Manage contest setup, problems, and live start-stop actions.',
    stats: [
      { label: 'Control', value: 'Create contests' },
      { label: 'Problems', value: 'Edit lineup' },
      { label: 'Live', value: 'Start / stop' },
    ],
    panelTitle: 'Enter admin access.',
  },
}

const Signin = () => {
  const router = useRouter()
  const { signIn, isAuthenticated, isLoading } = useUser()

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const [selectedRole, setSelectedRole] = useState('user')
  const activeContent = modeContent[selectedRole]

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace('/')
    }
  }, [isAuthenticated, isLoading, router])

  const handleChange = (event) => {
    const { name, value } = event.target
    setError('')
    setFormData((current) => ({ ...current, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      await signIn({ ...formData, role: selectedRole })
      router.push('/')
    } catch (submissionError) {
      setError(submissionError.message || 'Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading || isAuthenticated) {
    return (
      <AmbientPage>
        <main className={`${shellClass} flex min-h-screen items-center justify-center py-10`}>
          <Panel className="w-full max-w-3xl px-8 py-10 text-center sm:px-12 sm:py-12">
            <p className={eyebrowClass}>Session</p>
            <h1 className={`${headlineClass} mt-5 text-4xl leading-none sm:text-5xl`}>
              Routing your session.
            </h1>
          </Panel>
        </main>
      </AmbientPage>
    )
  }

  return (
    <AmbientPage>
      <main className={`${shellClass} min-h-screen py-6 sm:py-8`}>
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_480px] lg:items-center lg:gap-14">
          <section className="flex min-h-full flex-col justify-between py-2 lg:py-4">
            <BrandMark />

            <div className="max-w-4xl py-14 lg:py-20">
              <p className={eyebrowClass}>{activeContent.eyebrow}</p>
              <h1 className={`${headlineClass} mt-6 max-w-4xl text-5xl leading-[0.9] sm:text-6xl lg:text-[5.6rem]`}>
                {activeContent.headline}
              </h1>
              <p className={`${bodyTextClass} mt-6 max-w-xl`}>
                {activeContent.copy}
              </p>

              <div className="mt-12 grid gap-4 sm:grid-cols-3">
                {activeContent.stats.map((item) => (
                  <MiniStat key={item.label} label={item.label} value={item.value} />
                ))}
              </div>
            </div>

            <p className="text-sm text-black/52">
              New to Algora?{' '}
              <Link href="/auth/signup" className={textLinkClass}>
                Create account
              </Link>
            </p>
          </section>

          <section className="flex items-center justify-center lg:justify-end">
            <Panel className="w-full max-w-[480px] p-7 sm:p-8 lg:p-10">
              <div className="flex gap-3 rounded-[20px] border border-black/[0.08] bg-[#f7f4ee] p-2">
                {Object.entries(modeContent).map(([role, content]) => {
                  const isActive = role === selectedRole

                  return (
                    <button
                      key={role}
                      type="button"
                      onClick={() => {
                        setError('')
                        setSelectedRole(role)
                      }}
                      className={
                        isActive
                          ? `${primaryButtonClass} min-w-0 flex-1 px-4 py-3`
                          : `${secondaryButtonClass} min-w-0 flex-1 border-transparent px-4 py-3 shadow-none`
                      }
                    >
                      {content.eyebrow.replace(' sign in', '')}
                    </button>
                  )
                })}
              </div>

              <p className={`${eyebrowClass} mt-6`}>{activeContent.eyebrow}</p>
              <h2 className={`${headlineClass} mt-4 text-[2.4rem] leading-none`}>
                {activeContent.panelTitle}
              </h2>

              {error ? (
                <div className="mt-6 rounded-[20px] border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-700">
                  {error}
                </div>
              ) : null}

              <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                <div>
                  <label htmlFor="email" className={fieldLabelClass}>
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    autoComplete="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@algora.dev"
                    required
                    className={inputClass}
                  />
                </div>

                <div>
                  <label htmlFor="password" className={fieldLabelClass}>
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      type={isPasswordVisible ? 'text' : 'password'}
                      name="password"
                      autoComplete="current-password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Enter your password"
                      required
                      className={`${inputClass} pr-16`}
                    />
                    <button
                      type="button"
                      onClick={() => setIsPasswordVisible((prev) => !prev)}
                      className={passwordToggleClass}
                      aria-label={isPasswordVisible ? 'Hide password' : 'Show password'}
                    >
                      {isPasswordVisible ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" />
                          <line x1="1" y1="1" x2="23" y2="23" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`${primaryButtonClass} mt-2 w-full`}
                >
                  {isSubmitting ? 'Signing in...' : 'Sign in'}
                </button>
              </form>
            </Panel>
          </section>
        </div>
      </main>
    </AmbientPage>
  )
}

export default Signin
