import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useEffect, useState } from 'react'
import { content } from '../content'
import { siteConfig } from '../config/site'
import type { Language } from '../types'

const INTRO_KEY = 'bama-intro-seen'

export function BrandIntro({ language }: { language: Language }) {
  const reducedMotion = useReducedMotion()
  const [visible, setVisible] = useState(() => {
    try {
      return sessionStorage.getItem(INTRO_KEY) !== 'true'
    } catch {
      return false
    }
  })

  useEffect(() => {
    if (!visible) return
    if (reducedMotion) {
      try {
        sessionStorage.setItem(INTRO_KEY, 'true')
      } catch {
        // The page remains usable when storage is unavailable.
      }
      return
    }

    const timer = window.setTimeout(() => {
      try {
        sessionStorage.setItem(INTRO_KEY, 'true')
      } catch {
        // The intro still dismisses without session storage.
      }
      setVisible(false)
    }, 5600)

    return () => window.clearTimeout(timer)
  }, [reducedMotion, visible])

  const dismiss = () => {
    try {
      sessionStorage.setItem(INTRO_KEY, 'true')
    } catch {
      // The intro still dismisses without session storage.
    }
    setVisible(false)
  }

  return (
    <AnimatePresence>
      {visible && !reducedMotion && (
        <motion.div
          className="brand-intro"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, filter: 'blur(8px)' }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          aria-label={siteConfig.brand}
        >
          <div className="intro-network" aria-hidden="true">
            <i />
            <i />
            <i />
            <i />
          </div>
          <motion.div
            className="intro-mark-field"
            initial={{ clipPath: 'inset(50% 50% 50% 50%)', opacity: 0.2 }}
            animate={{ clipPath: 'inset(0% 0% 0% 0%)', opacity: 1 }}
            transition={{ delay: 2.2, duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <img src={siteConfig.logo} alt="BAMA Smart Solution" />
            <span className="intro-scan" aria-hidden="true" />
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 3.75, duration: 0.8 }}
          >
            {content[language].introLine}
          </motion.p>
          <button className="intro-skip" type="button" onClick={dismiss}>
            {content[language].skip}
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
