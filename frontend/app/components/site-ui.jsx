import Link from 'next/link'

const joinClasses = (...classes) => classes.filter(Boolean).join(' ')

export const shellClass = 'mx-auto w-full max-w-[1400px] px-6 sm:px-10 xl:px-12'

export const panelClass =
  'rounded-[32px] border border-black/[0.08] bg-white/82 shadow-[0_28px_90px_-42px_rgba(15,23,42,0.28)] backdrop-blur-sm'

export const subPanelClass =
  'rounded-[24px] border border-black/[0.08] bg-[#f7f4ee] shadow-[0_20px_60px_-46px_rgba(15,23,42,0.26)]'

export const eyebrowClass =
  'text-[11px] font-semibold uppercase tracking-[0.34em] text-black/45'

export const headlineClass =
  '[font-family:var(--font-space-grotesk)] font-semibold tracking-[-0.08em] text-[#0f1115]'

export const bodyTextClass = 'text-[17px] leading-8 text-black/58 sm:text-[18px]'

export const primaryButtonClass =
  'inline-flex items-center justify-center rounded-[18px] bg-[linear-gradient(135deg,#0f9fc5,#18c29c)] px-6 py-4 text-sm font-semibold text-white shadow-[0_24px_50px_-24px_rgba(15,159,197,0.9)] transition duration-200 hover:-translate-y-0.5 hover:bg-[linear-gradient(135deg,#13acd2,#1bcaa5)] hover:shadow-[0_28px_58px_-24px_rgba(24,194,156,0.95)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/10 focus-visible:ring-offset-2 focus-visible:ring-offset-[#f5f3ee] disabled:cursor-not-allowed disabled:opacity-60'

export const secondaryButtonClass =
  'inline-flex items-center justify-center rounded-[18px] border border-black/10 bg-white/90 px-6 py-4 text-sm font-semibold text-[#0f1115] shadow-[0_18px_45px_-36px_rgba(15,23,42,0.4)] transition duration-200 hover:-translate-y-0.5 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/10 focus-visible:ring-offset-2 focus-visible:ring-offset-[#f5f3ee] disabled:cursor-not-allowed disabled:opacity-60'

export const inputClass =
  'w-full rounded-[20px] border border-black/10 bg-[#f8f6f1] px-5 py-4 text-base text-[#0f1115] outline-none transition duration-200 placeholder:text-black/32 focus:border-black/15 focus:bg-white focus:shadow-[0_0_0_4px_rgba(15,17,21,0.05)]'

export const fieldLabelClass =
  'mb-2.5 block text-sm font-semibold text-black/64'

export const passwordToggleClass =
  'absolute right-3 top-1/2 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-[14px] border border-black/10 bg-white text-black/52 transition duration-200 hover:border-black/15 hover:text-[#0f1115] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/10 focus-visible:ring-offset-2 focus-visible:ring-offset-white'

export const textLinkClass =
  'font-semibold text-[#0f1115] underline decoration-black/15 underline-offset-4 transition duration-200 hover:decoration-black/55'

export function AmbientPage({ children }) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f5f3ee] text-[#0f1115]">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.98),transparent_28%),radial-gradient(circle_at_82%_14%,rgba(255,255,255,0.72),transparent_26%),linear-gradient(135deg,#f7f4ef_0%,#eeebe4_48%,#f6f3ee_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(15,17,21,0.035)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,17,21,0.035)_1px,transparent_1px)] bg-[size:112px_112px] opacity-35" />
        <div className="absolute left-[10%] top-16 h-56 w-56 rounded-full bg-white/80 blur-3xl" />
        <div className="absolute bottom-10 right-[10%] h-72 w-72 rounded-full bg-[#ebe7de]/80 blur-3xl" />
      </div>
      <div className="relative">{children}</div>
    </div>
  )
}

export function Panel({ children, className = '' }) {
  return <div className={joinClasses(panelClass, className)}>{children}</div>
}

export function SubPanel({ children, className = '' }) {
  return <div className={joinClasses(subPanelClass, className)}>{children}</div>
}

export function BrandMark({ compact = false, href = '/' }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-3 text-[#0f1115] transition duration-200 hover:opacity-80"
    >
      <span
        className={joinClasses(
          'flex items-center justify-center rounded-[18px] border border-black/10 bg-white shadow-[0_18px_40px_-30px_rgba(15,23,42,0.3)]',
          compact ? 'h-12 w-12 text-sm' : 'h-14 w-14 text-base'
        )}
      >
        {'</>'}
      </span>
      <span
        className={joinClasses(
          '[font-family:var(--font-space-grotesk)] font-semibold tracking-[-0.06em]',
          compact ? 'text-[2rem]' : 'text-[2.15rem]'
        )}
      >
        Algora
      </span>
    </Link>
  )
}

export function MiniStat({ label, value, className = '' }) {
  return (
    <SubPanel className={joinClasses('p-5', className)}>
      <p className={eyebrowClass}>{label}</p>
      <p className="mt-3 text-xl font-semibold tracking-[-0.04em] text-[#0f1115]">
        {value}
      </p>
    </SubPanel>
  )
}

export function DetailRow({ label, value, className = '' }) {
  return (
    <div
      className={joinClasses(
        'flex items-center justify-between gap-4 rounded-[18px] border border-black/[0.07] bg-white/80 px-4 py-3.5',
        className
      )}
    >
      <span className="text-xs font-semibold uppercase tracking-[0.28em] text-black/38">
        {label}
      </span>
      <span className="text-sm font-semibold text-[#0f1115]">{value}</span>
    </div>
  )
}
