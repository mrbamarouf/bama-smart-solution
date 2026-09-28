import { Component, useCallback, useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { content } from '../content'
import { siteConfig } from '../config/site'
import type { Language } from '../types'
import '../mobile/intro.css'
import './BrandIntro.css'

// Independent architectural compositions, not a redraw of the approved logo.
const desktopPaths = [
  'M600 400 H458 Q438 400 438 380 V248 H244 V320 H136',
  'M600 400 H744 Q766 400 766 378 V214 H970 V282 H1094',
  'M600 400 H420 V552 H242 V620 H126',
  'M600 400 H800 V526 H992 V598 H1104',
  'M438 248 V178 H636 Q746 178 746 270 Q746 342 636 342 H540',
  'M420 552 V624 H656 Q808 624 808 494 Q808 400 694 400',
]
const mobilePaths = [
  'M195 730 C195 692 102 704 102 625 S286 551 286 477 S195 438 195 366',
  'M102 625 V528 Q102 510 120 510 H168 V445 Q168 426 195 426',
  'M286 477 V296 H242 Q222 296 222 316 V366 H195',
  'M195 366 V252 H133 V190',
]
const desktopNodes = [[244, 248], [970, 214], [242, 552], [992, 526], [636, 178], [656, 624]]
const mobileNodes = [[102, 625], [286, 477], [168, 510], [222, 316]]

function SignalIntro({ language }: { language: Language }) {
  const [phase, setPhase] = useState<'playing' | 'leaving' | 'gone'>('playing')
  const [composition] = useState(() => window.matchMedia('(max-width: 1023px)').matches ? 'mobile' : 'desktop')
  const [reduced, setReduced] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  const [skipped, setSkipped] = useState(false)
  const root = useRef<HTMLDivElement>(null)
  const skip = useRef<HTMLButtonElement>(null)
  const logo = useRef<HTMLImageElement>(null)
  const active = phase !== 'gone'
  const mobile = composition === 'mobile'
  const finish = useCallback(() => setPhase('gone'), [])
  const dismiss = useCallback(() => {
    setSkipped(true)
    setPhase(current => current === 'gone' ? current : 'leaving')
  }, [])

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const change = () => setReduced(media.matches)
    media.addEventListener('change', change)
    return () => media.removeEventListener('change', change)
  }, [])

  useEffect(() => {
    if (!active) return
    const previousOverflow = document.body.style.overflow
    const previousFocus = document.activeElement
    document.body.style.overflow = 'hidden'
    const siblings = new Map<HTMLElement, boolean>()
    const isolate = () => {
      for (const child of root.current?.parentElement?.children ?? []) {
        if (child instanceof HTMLElement && child !== root.current && !siblings.has(child)) {
          siblings.set(child, child.inert)
          child.inert = true
        }
      }
    }
    isolate()
    const observer = new MutationObserver(isolate)
    if (root.current?.parentElement) observer.observe(root.current.parentElement, { childList: true })
    root.current?.focus({ preventScroll: true })
    // Independent wall-clock escape hatch, even if CSS animations never finish.
    const watchdog = window.setTimeout(finish, mobile ? 5600 : 6800)
    const assetDeadline = window.setTimeout(() => {
      if (!logo.current?.complete || !logo.current.naturalWidth) finish()
    }, 1600)
    const initialization = requestAnimationFrame(() => {
      if (!logo.current || getComputedStyle(logo.current).animationName === 'none') finish()
    })
    return () => {
      window.clearTimeout(watchdog)
      window.clearTimeout(assetDeadline)
      cancelAnimationFrame(initialization)
      observer.disconnect()
      siblings.forEach((inert, element) => { element.inert = inert })
      document.body.style.overflow = previousOverflow
      if (previousFocus instanceof HTMLElement && previousFocus !== document.body && previousFocus.isConnected) {
        previousFocus.focus({ preventScroll: true })
      }
    }
  }, [active, mobile, finish])

  useEffect(() => {
    if (phase === 'gone') return
    const duration = phase === 'leaving'
      ? (skipped || reduced ? 220 : mobile ? 550 : 500)
      : reduced ? 1450 : mobile ? 4450 : 5700
    const timer = window.setTimeout(() => setPhase(phase === 'playing' ? 'leaving' : 'gone'), duration)
    return () => window.clearTimeout(timer)
  }, [phase, reduced, mobile, skipped])

  if (!active) return null
  const paths = mobile ? mobilePaths : desktopPaths
  const nodes = mobile ? mobileNodes : desktopNodes

  return (
    <div
      ref={root}
      className={`signal-intro ${mobile ? 'm-intro' : 'signal-intro-desktop'}`}
      data-composition={composition}
      data-phase={phase}
      data-reduced={reduced}
      data-skipped={skipped}
      dir={language === 'ar' ? 'rtl' : 'ltr'}
      lang={language}
      role="dialog"
      tabIndex={-1}
      aria-modal="true"
      aria-label={siteConfig.brand}
      aria-describedby="signal-statement"
      onKeyDown={event => {
        if (event.key === 'Escape') dismiss()
        if (event.key === 'Tab') { event.preventDefault(); skip.current?.focus() }
      }}
    >
      <div className="signal-veil" aria-hidden="true" />
      <div className="signal-atmosphere" aria-hidden="true" />
      <div className="signal-field" aria-hidden="true">
        <svg className="signal-map" viewBox={mobile ? '0 0 390 844' : '0 0 1200 800'} fill="none" preserveAspectRatio="xMidYMid meet">
          <g className="signal-architecture">
            {paths.map(path => <path d={path} key={path} />)}
          </g>
          <g className="signal-connections">
            {paths.map((path, index) => (
              <path className="signal-route" d={path} pathLength="1" key={path} style={{ '--route': index } as CSSProperties} />
            ))}
            {nodes.map(([cx, cy], index) => (
              <g className="signal-node" key={`${cx}-${cy}`} style={{ '--node': index } as CSSProperties}>
                <circle cx={cx} cy={cy} r="7" className="signal-node-halo" />
                <circle cx={cx} cy={cy} r="2" />
              </g>
            ))}
          </g>
        </svg>
        <span className="signal-origin" />
        <span className="signal-first-pulse" />
      </div>
      <div className="signal-ignition" aria-hidden="true" />
      <div className="signal-identity">
        <img ref={logo} className="signal-logo" src={siteConfig.markWhite} width="512" height="512" alt="BAMA" fetchPriority="high" decoding="async" onError={finish} />
        <p className="signal-brand" dir="ltr">BAMA SMART SOLUTION</p>
        <p className="signal-statement" id="signal-statement">
          {language === 'ar' ? (
            <>نربط اليوم{mobile ? <br /> : ' '}بمستقبل أكثر ذكاءً</>
          ) : (
            <>CONNECTING A{mobile ? <br /> : ' '}SMARTER TOMORROW</>
          )}
        </p>
      </div>
      <div className="signal-release" aria-hidden="true" />
      <button ref={skip} className="signal-skip" type="button" onClick={dismiss}>{content[language].skip}</button>
    </div>
  )
}

// An intro failure must never take down the website beneath it.
class IntroBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() { return { failed: true } }
  render() { return this.state.failed ? null : this.props.children }
}

export function BrandIntro({ language }: { language: Language }) {
  return <IntroBoundary><SignalIntro language={language} /></IntroBoundary>
}
