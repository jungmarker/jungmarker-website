import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

const NAV_LINKS = [
  { label: 'About',      href: '#about'     },
  { label: 'Properties', href: '#listings'  },
  { label: 'Services',   href: '#services'  },
  { label: 'Stories',    href: '#stories'   },
  { label: 'Contact',    href: '#contact'   },
]

export default function Nav() {
  const [scrolled, setScrolled]   = useState(false)
  const [atTop,    setAtTop]       = useState(true)
  const [menuOpen, setMenuOpen]   = useState(false)

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40)
      setAtTop(window.scrollY < 10)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const close = () => setMenuOpen(false)

  // Over hero: white text / transparent; after scroll: light glass + dark text
  const overHero = atTop

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled ? 'glass shadow-sm' : ''
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-10 py-5 flex items-center justify-between">

          {/* Wordmark */}
          <a href="#" className="group flex flex-col leading-none gap-1">
            <span className={`font-grotesk font-light text-xl tracking-wide transition-colors duration-300 ${
              overHero ? 'text-white' : 'text-charcoal'
            } group-hover:text-gold`}>
              Nick Jungmarker
            </span>
            <span className={`font-grotesk font-medium text-xs tracking-[.18em] uppercase transition-colors duration-300 ${
              overHero ? 'text-white/50' : 'text-ash'
            }`}>
              Maryland Realtor
            </span>
          </a>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8" aria-label="Site navigation">
            {NAV_LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className={`relative font-grotesk font-light text-base tracking-wide pb-0.5 transition-colors duration-200 group ${
                  overHero ? 'text-white/80 hover:text-white' : 'text-ash hover:text-charcoal'
                }`}
              >
                {l.label}
                {/* Animated underline */}
                <span className="absolute bottom-0 left-0 w-0 h-px bg-md-red transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </nav>

          {/* Desktop CTA */}
          <a
            href="tel:+13018757182"
            className={`hidden md:flex items-center gap-2 font-grotesk font-medium text-base tracking-wide px-5 py-2.5 border transition-all duration-200 ${
              overHero
                ? 'border-white/30 text-white hover:border-white/60 hover:bg-white/8'
                : 'border-md-red text-md-red hover:bg-md-red hover:text-white'
            }`}
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
            </svg>
            (301) 875-7182
          </a>

          {/* Hamburger */}
          <button
            className={`md:hidden p-2 transition-colors ${overHero ? 'text-white' : 'text-charcoal'}`}
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              {menuOpen
                ? <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden bg-warm-white border-t border-charcoal/8 px-6 pb-6">
            <div className="py-4 space-y-1">
              {NAV_LINKS.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={close}
                  className="block py-3.5 font-grotesk font-light text-lg text-charcoal/70 hover:text-charcoal border-b border-charcoal/6 transition-colors"
                >
                  {l.label}
                </a>
              ))}
            </div>
            <a
              href="tel:+13018757182"
              onClick={close}
              className="mt-2 inline-flex items-center gap-2 font-grotesk font-medium text-base text-md-red"
            >
              (301) 875-7182
            </a>
          </div>
        )}
      </motion.header>
    </>
  )
}
